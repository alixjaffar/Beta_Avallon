// CHANGELOG: 2025-10-11 - Add mocking when unconfigured and better error handling
// CHANGELOG: 2025-10-10 - Add Lovable SiteProvider implementation
import axios from 'axios';
import type { SiteProvider, GenerateSiteInput, GenerateSiteResult } from '@/lib/providers/sites';
import { logError, logInfo } from '@/lib/log';

const base = process.env.LOVABLE_BASE_URL || '';
const key = process.env.LOVABLE_API_KEY || '';

const isConfigured = !!(base && key);

export class LovableProvider implements SiteProvider {
  async generateSite(input: GenerateSiteInput): Promise<GenerateSiteResult> {
    if (!isConfigured) {
      logInfo('Lovable not configured, returning mocked site', input);
      return {
        previewUrl: `https://mock-${input.name.toLowerCase().replace(/\s+/g, '-')}.lovable.app`,
        repoUrl: `https://github.com/mock/${input.name.toLowerCase().replace(/\s+/g, '-')}`,
      };
    }

    try {
      const response = await axios.post(
        `${base}/v1/sites/generate`,
        { name: input.name, mode: input.mode },
        { headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' } }
      );

      const result: GenerateSiteResult = {
        previewUrl: response.data.previewUrl,
        repoUrl: response.data.repoUrl || response.data.repositoryUrl,
      };

      logInfo('Lovable site generated', { name: input.name, previewUrl: result.previewUrl });
      return result;
    } catch (error: any) {
      logError('Lovable generateSite error', error, input);
      throw new Error(`Failed to generate site: ${error.message}`);
    }
  }
}

export function isLovableConfigured(): boolean {
  return isConfigured;
}


