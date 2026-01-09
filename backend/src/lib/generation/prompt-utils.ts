/**
 * Prompt utility functions for enhancing user prompts
 */

/**
 * Apply "toon style" enhancements to prompts
 * This adds styling instructions to make prompts more effective for website generation
 */
export function applyToonStylePrompt(prompt: string): string {
  if (!prompt || typeof prompt !== 'string') {
    return prompt;
  }

  // If the prompt already contains style instructions, return as-is
  if (prompt.toLowerCase().includes('modern') || 
      prompt.toLowerCase().includes('design') ||
      prompt.toLowerCase().includes('style')) {
    return prompt;
  }

  // Add modern, clean styling instructions to enhance the prompt
  return `${prompt} Use modern, clean design with professional styling.`;
}
