/**
 * Prompt template for iterative modifications
 * Generates updated SiteSpec or partial spec changes
 */
import { SiteSpec } from '../site-spec';
import { applyToonStylePrompt } from '../prompt-utils';

export function buildIterationPrompt(
  userRequest: string,
  currentSpec: SiteSpec,
  chatHistory?: any[]
): string {
  const styledRequest = applyToonStylePrompt(userRequest);
  // Compress spec JSON to save tokens
  const currentSpecJson = JSON.stringify(currentSpec);
  const historyContext = chatHistory && chatHistory.length > 0
    ? `\nHISTORY:\n${chatHistory.slice(-3).map((msg: any) => `${msg.role}:${msg.content.substring(0, 150)}`).join('\n')}`
    : '';

  return `Modify SiteSpec per request. Return ONLY changed fields as JSON diff.

REQUEST: "${styledRequest}"${historyContext}

CURRENT:${currentSpecJson}

RULES: Return only modified fields. Preserve website type/structure. Only change requested.

EXAMPLES:
"change theme to pastel green" → {"brand":{"colors":{"primary":"#a8e6cf","secondary":"#dcedc1"}}}
"add testimonials" → {"pages":[{"id":"home","sections":[...existing...,{"id":"testimonials-1","type":"testimonials","order":3,"visible":true}]}]}
"rename to Shoe Shop" → {"project":{"name":"Shoe Shop"}}

Return JSON only, start with {
`;
}
