// CHANGELOG: 2025-01-15 - Add comprehensive error handling for Claude site generation
import { logError } from '@/lib/log';

export type ClaudeErrorType = 
  | 'api_error'
  | 'rate_limit'
  | 'authentication_error'
  | 'generation_failed'
  | 'github_error'
  | 'vercel_error'
  | 'timeout'
  | 'unknown';

export class ClaudeError extends Error {
  public readonly type: ClaudeErrorType;
  public readonly retryable: boolean;
  public readonly userMessage: string;

  constructor(
    type: ClaudeErrorType,
    message: string,
    userMessage: string,
    retryable: boolean = false,
    originalError?: Error
  ) {
    super(message);
    this.name = 'ClaudeError';
    this.type = type;
    this.retryable = retryable;
    this.userMessage = userMessage;
    
    if (originalError) {
      this.cause = originalError;
    }
  }
}

export class ClaudeErrorHandler {
  static handleClaudeError(error: any): ClaudeError {
    if (error.response?.status === 429) {
      return new ClaudeError(
        'rate_limit',
        'Claude API rate limit exceeded',
        'Too many requests. Please wait a moment and try again.',
        true
      );
    }

    if (error.response?.status === 401) {
      return new ClaudeError(
        'authentication_error',
        'Claude API authentication failed',
        'API authentication failed. Please check your Claude API key.',
        false
      );
    }

    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return new ClaudeError(
        'timeout',
        'Claude API request timed out',
        'Request timed out. Please try again.',
        true
      );
    }

    if (error.message.includes('Failed to generate site')) {
      return new ClaudeError(
        'generation_failed',
        'Site generation failed',
        'Failed to generate site code. Please try again with a different name.',
        true
      );
    }

    return new ClaudeError(
      'api_error',
      error.message || 'Unknown Claude API error',
      'An error occurred while generating your site. Please try again.',
      true,
      error
    );
  }

  static handleGitHubError(error: any): ClaudeError {
    if (error.response?.status === 401) {
      return new ClaudeError(
        'authentication_error',
        'GitHub API authentication failed',
        'GitHub authentication failed. Please check your GitHub token.',
        false
      );
    }

    if (error.response?.status === 422) {
      return new ClaudeError(
        'github_error',
        'GitHub repository already exists',
        'A repository with this name already exists. Please try a different name.',
        false
      );
    }

    return new ClaudeError(
      'github_error',
      error.message || 'GitHub API error',
      'Failed to create GitHub repository. Please try again.',
      true,
      error
    );
  }

  static handleVercelError(error: any): ClaudeError {
    if (error.response?.status === 401) {
      return new ClaudeError(
        'authentication_error',
        'Vercel API authentication failed',
        'Vercel authentication failed. Please check your Vercel token.',
        false
      );
    }

    if (error.response?.status === 400) {
      return new ClaudeError(
        'vercel_error',
        'Invalid Vercel project configuration',
        'Invalid project configuration. Please try again.',
        false
      );
    }

    return new ClaudeError(
      'vercel_error',
      error.message || 'Vercel API error',
      'Failed to deploy to Vercel. Please try again.',
      true,
      error
    );
  }

  static getRetryDelay(attempt: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s
    return Math.min(1000 * Math.pow(2, attempt), 30000);
  }

  static shouldRetry(error: ClaudeError, attempt: number): boolean {
    if (!error.retryable) return false;
    if (attempt >= 3) return false; // Max 3 retries
    
    return true;
  }
}

export function createFallbackSite(name: string): { previewUrl: string; repoUrl: string } {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  return {
    previewUrl: `https://${slug}.vercel.app`,
    repoUrl: `https://github.com/your-org/${slug}`
  };
}
