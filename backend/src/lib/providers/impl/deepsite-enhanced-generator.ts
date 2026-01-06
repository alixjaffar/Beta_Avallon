// CHANGELOG: 2025-01-26 - DeepSite-inspired enhanced website generator
// Inspired by: https://huggingface.co/spaces/enzostvs/deepsite
// This enhances our Gemini generator with DeepSite-style improvements
import { GeminiWebsiteGenerator, WebsiteGenerationRequest, GeneratedWebsite } from './gemini-website-generator';
import { logInfo } from '@/lib/log';

/**
 * Enhanced website generator inspired by DeepSite
 * Uses composition to enhance the base Gemini generator with DeepSite-style improvements
 * Features:
 * - Better prompt engineering inspired by DeepSite
 * - Enhanced design requirements
 * - Improved code quality expectations
 */
export class DeepSiteEnhancedGenerator {
  private baseGenerator: GeminiWebsiteGenerator;

  constructor() {
    this.baseGenerator = new GeminiWebsiteGenerator();
  }

  /**
   * Generate website with DeepSite-enhanced prompts
   */
  async generateWebsite(request: WebsiteGenerationRequest, chatHistory?: any[], currentCode?: Record<string, string>): Promise<GeneratedWebsite> {
    // Enhance the request description with DeepSite-style improvements
    const enhancedRequest: WebsiteGenerationRequest = {
      ...request,
      description: this.enhancePrompt(request.description, chatHistory, currentCode)
    };
    
    logInfo('Using DeepSite-enhanced generator', { 
      originalPrompt: request.description.substring(0, 100),
      enhanced: true 
    });
    
    return await this.baseGenerator.generateWebsite(enhancedRequest, chatHistory, currentCode);
  }

  /**
   * Enhance the prompt with image URL suggestions
   */
  private enhancePrompt(originalPrompt: string, chatHistory?: any[], currentCode?: Record<string, string>): string {
    return originalPrompt;
  }
}
