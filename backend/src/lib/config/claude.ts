// CHANGELOG: 2025-01-15 - Claude API configuration and validation
export const CLAUDE_CONFIG = {
  API_KEY: process.env.CLAUDE_API_KEY || '',
  BASE_URL: process.env.CLAUDE_BASE_URL || 'https://api.anthropic.com/v1',
  MODEL: 'claude-3-5-sonnet-20241022',
  MAX_TOKENS: 8000,
  TIMEOUT: 120000, // 2 minutes
};

export function validateClaudeConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!CLAUDE_CONFIG.API_KEY) {
    errors.push('CLAUDE_API_KEY is required');
  } else if (!CLAUDE_CONFIG.API_KEY.startsWith('sk-ant-')) {
    errors.push('CLAUDE_API_KEY must start with "sk-ant-"');
  }
  
  if (!CLAUDE_CONFIG.BASE_URL) {
    errors.push('CLAUDE_BASE_URL is required');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export function getClaudeHeaders() {
  return {
    'Authorization': `Bearer ${CLAUDE_CONFIG.API_KEY}`,
    'Content-Type': 'application/json',
    'anthropic-version': '2023-06-01'
  };
}
