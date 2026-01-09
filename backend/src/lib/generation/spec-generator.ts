/**
 * SiteSpec Generator - Uses Gemini 3 Pro to generate SiteSpec from user prompt
 */
import axios from 'axios';
import { logInfo, logError } from '@/lib/log';
import { SiteSpecSchema, SiteSpec } from './site-spec';
import { buildSpecGenerationPrompt } from './prompts/spec';

export class SiteSpecGenerator {
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
   * Generate SiteSpec from user prompt
   */
  async generateSpec(userPrompt: string, chatHistory?: any[]): Promise<SiteSpec> {
    try {
      logInfo('Generating SiteSpec from user prompt', {
        prompt: userPrompt.substring(0, 100),
        chatHistoryLength: chatHistory?.length || 0
      });

      const prompt = buildSpecGenerationPrompt(userPrompt, chatHistory);
      
      // Use Gemini models - prioritize 2.5 Pro (Gemini 3 Pro) as most reliable
      const models = ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash-exp', 'gemini-1.5-pro'];
      let lastError: any = null;

      for (const model of models) {
        try {
          logInfo('Calling Gemini for SiteSpec generation', { model, useVertexAI: this.useVertexAI });

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
                temperature: 0.3, // Lower for more deterministic spec generation
                topK: 20,
                topP: 0.95,
                maxOutputTokens: 16384, // Specs can be large
                responseMimeType: 'application/json', // Force JSON output
              }
            },
            {
              headers,
              timeout: 120000 // 2 minutes
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

          // Parse and validate the JSON
          let specJson: any;
          try {
            // Remove any markdown code blocks if present
            const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            specJson = JSON.parse(cleanedContent);
          } catch (parseError: any) {
            logError('Failed to parse SiteSpec JSON', parseError, { content: content.substring(0, 500) });
            throw new Error(`Invalid JSON from Gemini: ${parseError.message}`);
          }

          // Validate against Zod schema
          const validatedSpec = SiteSpecSchema.parse(specJson);
          
          logInfo('✅ SiteSpec generated and validated successfully', {
            model,
            pagesCount: validatedSpec.pages.length,
            hasStripe: validatedSpec.integrations?.some((i: { type: string; enabled: boolean }) => i.type === 'stripe' && i.enabled)
          });

          return validatedSpec;

        } catch (error: any) {
          lastError = error;
          const status = error.response?.status;
          
          // If model not found, try next
          if (status === 404) {
            logInfo(`Model ${model} not available, trying next`, { model });
            continue;
          }
          
          // If quota exceeded, try next
          if (status === 429) {
            logInfo(`Model ${model} quota exceeded, trying next`, { model });
            continue;
          }
          
          // For other errors, try next model
          if (status !== 401 && status !== 403) {
            logInfo(`Model ${model} failed, trying next`, { model, error: error.message });
            continue;
          }
          
          // Auth errors - don't retry
          throw error;
        }
      }

      throw new Error(`All Gemini models failed: ${lastError?.message || 'Unknown error'}`);

    } catch (error: any) {
      logError('SiteSpec generation failed', error);
      throw error;
    }
  }
}
