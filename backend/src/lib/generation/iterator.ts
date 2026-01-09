/**
 * Iterator - Handles iterative modifications to SiteSpec
 * Only updates changed sections, maintains version history
 */
import { SiteSpec, SiteSpecSchema } from './site-spec';
import { logInfo, logError } from '@/lib/log';
import { buildIterationPrompt } from './prompts/iterate';
import axios from 'axios';

export class SiteIterator {
  private apiKey: string;
  private baseUrl: string;
  private useVertexAI: boolean;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_CLOUD_API_KEY || '';
    this.apiKey = apiKey.replace(/^["']|["']$/g, '').trim();
    
    // Check if using Vertex AI (Google Cloud) or standard Gemini API
    this.useVertexAI = process.env.USE_VERTEX_AI === 'true' || this.apiKey.startsWith('AQ.');
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || process.env.GCP_PROJECT_ID || '';
    const region = process.env.GOOGLE_CLOUD_REGION || process.env.GCP_REGION || 'us-central1';
    
    if (this.useVertexAI) {
      this.baseUrl = `https://${region}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${region}/publishers/google/models`;
    } else {
      this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    }
    
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY or GOOGLE_CLOUD_API_KEY not configured');
    }
  }

  /**
   * Generate updated SiteSpec from iteration request
   * Returns only the changed parts (diff format)
   */
  async generateIteration(
    userRequest: string,
    currentSpec: SiteSpec,
    chatHistory?: any[]
  ): Promise<Partial<SiteSpec>> {
    try {
      logInfo('Generating iteration', {
        request: userRequest.substring(0, 100),
        currentPagesCount: currentSpec.pages.length
      });

      const prompt = buildIterationPrompt(userRequest, currentSpec, chatHistory);
      
      // Use Gemini models - prioritize 2.5 Pro (Gemini 3 Pro) as most reliable
      const models = ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash-exp', 'gemini-1.5-pro'];
      let lastError: any = null;

      for (const model of models) {
        try {
          logInfo('Calling Gemini for iteration', { model, useVertexAI: this.useVertexAI });

          // Build URL and headers based on API type
          let apiUrl: string;
          let headers: Record<string, string> = { 'Content-Type': 'application/json' };
          
          if (this.useVertexAI) {
            apiUrl = `${this.baseUrl}/${model}:generateContent`;
            headers['Authorization'] = `Bearer ${this.apiKey}`;
            headers['x-goog-api-key'] = this.apiKey;
          } else {
            apiUrl = `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`;
          }

          const response = await axios.post(
            apiUrl,
            {
              contents: [{
                parts: [{
                  text: prompt
                }]
              }],
              generationConfig: {
                temperature: 0.3, // Low for precise modifications
                topK: 20,
                topP: 0.95,
                maxOutputTokens: 16384,
                responseMimeType: 'application/json',
              }
            },
            {
              headers,
              timeout: 120000
            }
          );

          if (!response.data.candidates || response.data.candidates.length === 0) {
            throw new Error('Gemini API returned no candidates');
          }

          const candidate = response.data.candidates[0];
          const content = candidate.content.parts[0].text;
          
          if (!content) {
            throw new Error('Gemini API returned empty content');
          }

          // Parse the partial spec (diff)
          let partialSpec: Partial<SiteSpec>;
          try {
            const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            partialSpec = JSON.parse(cleanedContent);
          } catch (parseError: any) {
            logError('Failed to parse iteration spec', parseError);
            throw new Error(`Invalid JSON from Gemini: ${parseError.message}`);
          }

          logInfo('✅ Iteration spec generated', {
            model,
            changedFields: Object.keys(partialSpec)
          });

          return partialSpec;

        } catch (error: any) {
          lastError = error;
          const status = error.response?.status;
          
          if (status === 404 || status === 429) {
            logInfo(`Model ${model} unavailable, trying next`, { model });
            continue;
          }
          
          if (status !== 401 && status !== 403) {
            continue;
          }
          
          throw error;
        }
      }

      throw new Error(`All Gemini models failed: ${lastError?.message || 'Unknown error'}`);

    } catch (error: any) {
      logError('Iteration generation failed', error);
      throw error;
    }
  }

  /**
   * Merge partial spec into current spec (deep merge)
   */
  mergeSpec(currentSpec: SiteSpec, partialSpec: Partial<SiteSpec>): SiteSpec {
    const merged = { ...currentSpec };

    // Merge brand
    if (partialSpec.brand) {
      merged.brand = {
        ...currentSpec.brand,
        ...partialSpec.brand,
        colors: {
          ...currentSpec.brand.colors,
          ...(partialSpec.brand.colors || {})
        },
        fonts: {
          ...currentSpec.brand.fonts,
          ...(partialSpec.brand.fonts || {})
        }
      };
    }

    // Merge project
    if (partialSpec.project) {
      merged.project = {
        ...currentSpec.project,
        ...partialSpec.project
      };
    }

    // Merge pages (more complex - need to update specific pages)
    if (partialSpec.pages) {
      const updatedPages = [...currentSpec.pages];
      
      partialSpec.pages.forEach(partialPage => {
        const existingIndex = updatedPages.findIndex(p => p.id === partialPage.id);
        
        if (existingIndex >= 0) {
          // Update existing page
          updatedPages[existingIndex] = {
            ...updatedPages[existingIndex],
            ...partialPage,
            sections: partialPage.sections || updatedPages[existingIndex].sections
          };
        } else {
          // New page
          updatedPages.push(partialPage);
        }
      });
      
      merged.pages = updatedPages;
    }

    // Merge integrations
    if (partialSpec.integrations) {
      const existingIntegrations = Array.isArray(currentSpec.integrations) ? currentSpec.integrations : [];
      const newIntegrations = Array.isArray(partialSpec.integrations) ? partialSpec.integrations : [];
      merged.integrations = [...existingIntegrations, ...newIntegrations];
    }

    // Merge assets
    if (partialSpec.assets) {
      merged.assets = [
        ...(currentSpec.assets || []),
        ...partialSpec.assets
      ];
    }

    return merged;
  }

  /**
   * Determine which files need to be regenerated based on spec changes
   */
  getFilesToRegenerate(
    currentSpec: SiteSpec,
    updatedSpec: SiteSpec
  ): string[] {
    const filesToRegenerate: string[] = [];

    // Always regenerate layout if brand changed
    if (JSON.stringify(currentSpec.brand) !== JSON.stringify(updatedSpec.brand)) {
      filesToRegenerate.push('app/layout.tsx');
      filesToRegenerate.push('tailwind.config.ts');
    }

    // Regenerate pages that changed
    updatedSpec.pages.forEach(page => {
      const currentPage = currentSpec.pages.find(p => p.id === page.id);
      
      if (!currentPage || JSON.stringify(currentPage) !== JSON.stringify(page)) {
        if (page.path === '/') {
          filesToRegenerate.push('app/page.tsx');
        } else {
          filesToRegenerate.push(`app${page.path}/page.tsx`);
        }
      }
    });

    // Regenerate sections that changed
    updatedSpec.pages.forEach(page => {
      page.sections.forEach(section => {
        const sectionFile = `components/sections/${section.type}.tsx`;
        if (!filesToRegenerate.includes(sectionFile)) {
          filesToRegenerate.push(sectionFile);
        }
      });
    });

    return filesToRegenerate;
  }
}
