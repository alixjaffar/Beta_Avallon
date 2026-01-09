/**
 * Code Generator - Generates Next.js code from SiteSpec
 */
import axios from 'axios';
import { logInfo, logError } from '@/lib/log';
import { SiteSpec } from './site-spec';
import { buildCodegenPrompt } from './prompts/codegen';
import * as fs from 'fs';
import * as path from 'path';

export interface CodeFileMap {
  [filePath: string]: string;
}

export class CodeGenerator {
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
   * Generate Next.js code files from SiteSpec
   */
  async generateCode(siteSpec: SiteSpec): Promise<CodeFileMap> {
    try {
      logInfo('Generating code from SiteSpec', {
        pagesCount: siteSpec.pages.length,
        projectName: siteSpec.project.name
      });

      const prompt = buildCodegenPrompt(siteSpec);
      
      // Use Gemini models - prioritize 2.5 Pro (Gemini 3 Pro) as most reliable
      const models = ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash-exp', 'gemini-1.5-pro'];
      let lastError: any = null;

      for (const model of models) {
        try {
          logInfo('Calling Gemini for code generation', { model, useVertexAI: this.useVertexAI });

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
                temperature: 0.4, // Slightly higher for code creativity
                topK: 32,
                topP: 0.95,
                maxOutputTokens: 81920, // Large for multi-file generation
                responseMimeType: 'application/json', // Force JSON output
              }
            },
            {
              headers,
              timeout: 300000 // 5 minutes for code generation
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

          // Parse the file map JSON
          let fileMap: CodeFileMap;
          try {
            // Remove any markdown code blocks
            const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            fileMap = JSON.parse(cleanedContent);
          } catch (parseError: any) {
            logError('Failed to parse code file map', parseError, { content: content.substring(0, 500) });
            throw new Error(`Invalid JSON from Gemini: ${parseError.message}`);
          }

          // Validate file map structure
          if (!fileMap || typeof fileMap !== 'object') {
            throw new Error('Invalid file map structure');
          }

          const fileCount = Object.keys(fileMap).length;
          logInfo('✅ Code generated successfully', {
            model,
            fileCount,
            files: Object.keys(fileMap)
          });

          return fileMap;

        } catch (error: any) {
          lastError = error;
          const status = error.response?.status;
          
          if (status === 404 || status === 429) {
            logInfo(`Model ${model} unavailable, trying next`, { model, status });
            continue;
          }
          
          if (status !== 401 && status !== 403) {
            logInfo(`Model ${model} failed, trying next`, { model, error: error.message });
            continue;
          }
          
          throw error;
        }
      }

      throw new Error(`All Gemini models failed: ${lastError?.message || 'Unknown error'}`);

    } catch (error: any) {
      logError('Code generation failed', error);
      throw error;
    }
  }

  /**
   * Write code files to project workspace
   */
  async writeFiles(projectPath: string, fileMap: CodeFileMap): Promise<void> {
    try {
      // Ensure project directory exists
      if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath, { recursive: true });
      }

      // Write each file
      for (const [filePath, content] of Object.entries(fileMap)) {
        const fullPath = path.join(projectPath, filePath);
        const dir = path.dirname(fullPath);
        
        // Ensure directory exists
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        // Write file
        fs.writeFileSync(fullPath, content, 'utf8');
        logInfo('Wrote file', { filePath, size: content.length });
      }

      logInfo('✅ All files written to workspace', {
        projectPath,
        fileCount: Object.keys(fileMap).length
      });

    } catch (error: any) {
      logError('Failed to write files', error);
      throw error;
    }
  }
}
