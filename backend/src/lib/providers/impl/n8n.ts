// CHANGELOG: 2025-10-12 - Return embed code when creating agents
// CHANGELOG: 2025-10-11 - Enhance n8n provider with mocking and better workflow structure
// CHANGELOG: 2025-10-10 - Add n8n AgentProvider implementation
import axios from 'axios';
import type { AgentProvider, CreateAgentInput, CreateAgentResult } from '@/lib/providers/agents';
import { logError, logInfo } from '@/lib/log';

const N8N = (process.env.N8N_BASE_URL || '').trim().replace(/\/$/, ''); // Remove trailing slash
const N8N_KEY = (process.env.N8N_API_KEY || '').trim().replace(/^["']|["']$/g, ''); // Remove quotes and trim

const isConfigured = !!(N8N && N8N_KEY);

export class N8nProvider implements AgentProvider {
  async createAgent(input: CreateAgentInput): Promise<CreateAgentResult> {
    if (!isConfigured) {
      logInfo('n8n not configured, returning mocked agent', input);
      const fallbackId = `mock-n8n-${Date.now()}`;
      return { externalId: fallbackId, embedCode: this.buildEmbedCode(fallbackId) };
    }

    try {
      // Create a workflow with AI Agent node structure
      const workflow = this.buildAIAgentWorkflow(input.name, input.prompt);
      
      // Ensure API key is properly formatted (remove any quotes or whitespace)
      const cleanApiKey = N8N_KEY.trim().replace(/^["']|["']$/g, '');
      
      logInfo('Creating n8n workflow', { 
        baseUrl: N8N, 
        hasApiKey: !!cleanApiKey,
        apiKeyLength: cleanApiKey.length,
        apiKeyPrefix: cleanApiKey.substring(0, 10) + '...'
      });
      
      const response = await axios.post(
        `${N8N}/api/v1/workflows`,
        workflow,
        { 
          headers: { 
            'X-N8N-API-KEY': cleanApiKey,
            'Content-Type': 'application/json' 
          } 
        }
      );

      const rawId = response.data?.id ?? response.data?.workflowId ?? response.data?.data?.id;
      const workflowId = rawId ? String(rawId) : this.generateWebhookId();
      
      // Activate the workflow only if requested and when we have a real ID
      const shouldActivate = input.activate !== false; // Default to true for backward compatibility
      if (rawId && shouldActivate) {
        await this.activateWorkflow(workflowId);
      }

      logInfo('n8n agent created', { workflowId, name: input.name });
      return { externalId: workflowId, embedCode: this.buildEmbedCode(workflowId) };
    } catch (error: unknown) {
      let message = 'Unknown error';
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          const status = error.response.status;
          const statusText = error.response.statusText;
          const responseData = error.response.data;
          
          if (status === 401) {
            message = `n8n API authentication failed (401 Unauthorized). Please verify:
1. Your API key is correct in backend/.env (N8N_API_KEY)
2. The API key has not expired
3. API access is enabled in your n8n instance (Settings → API)
4. The n8n instance is accessible at ${N8N}
Response: ${JSON.stringify(responseData)}`;
          } else {
            message = `n8n API error: ${status} ${statusText}. ${JSON.stringify(responseData)}`;
          }
        } else if (error.request) {
          // Request made but no response (network error)
          message = `Cannot connect to n8n at ${N8N}. Make sure:
1. n8n is running and accessible
2. The URL (${N8N}) is correct
3. Network connectivity is available`;
        } else {
          message = error.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }
      logError('n8n createAgent error', error, { input, message, baseUrl: N8N, hasApiKey: !!N8N_KEY });
      throw new Error(`Failed to create n8n agent: ${message}`);
    }
  }

  private buildAIAgentWorkflow(name: string, prompt: string) {
    const webhookId = this.generateWebhookId();
    
    // Try to use AI Agent node if available, otherwise fallback to OpenAI node
    // Check if we should use LangChain AI Agent (more advanced) or OpenAI (simpler)
    const useAIAgent = process.env.N8N_USE_AI_AGENT_NODE === 'true';
    
    if (useAIAgent) {
      // Use n8n's AI Agent node (LangChain-based) for better prompt handling
      return {
        name,
        nodes: [
          {
            id: 'webhook',
            name: 'Webhook',
            type: 'n8n-nodes-base.webhook',
            typeVersion: 1,
            position: [250, 300],
            parameters: {
              path: webhookId,
              httpMethod: 'POST',
              responseMode: 'responseNode',
            },
            webhookId,
          },
          {
            id: 'aiAgent',
            name: 'AI Agent',
            type: 'n8n-nodes-langchain.agent',
            typeVersion: 1,
            position: [450, 300],
            parameters: {
              agent: 'openAiFunctions',
              model: 'gpt-4',
              systemMessage: `You are an AI assistant specialized in website generation and automation. ${prompt}`,
              options: {
                temperature: 0.7,
                maxTokens: 2000,
              },
            },
          },
          {
            id: 'respond',
            name: 'Respond to Webhook',
            type: 'n8n-nodes-base.respondToWebhook',
            typeVersion: 1,
            position: [650, 300],
            parameters: {
              respondWith: 'json',
              responseBody: '={{ $json.output }}',
            },
          },
        ],
        connections: {
          Webhook: {
            main: [[{ node: 'AI Agent', type: 'main', index: 0 }]],
          },
          'AI Agent': {
            main: [[{ node: 'Respond to Webhook', type: 'main', index: 0 }]],
          },
        },
        // Don't include 'active' field - it's read-only and set via separate API call
        settings: {},
      };
    }
    
    // Fallback to OpenAI node (simpler, more compatible)
    return {
      name,
      nodes: [
        {
          id: 'webhook',
          name: 'Webhook',
          type: 'n8n-nodes-base.webhook',
          typeVersion: 1,
          position: [250, 300],
          parameters: {
            path: webhookId,
            httpMethod: 'POST',
            responseMode: 'responseNode',
          },
          webhookId,
        },
        {
          id: 'openAi',
          name: 'OpenAI',
          type: 'n8n-nodes-base.openAi',
          typeVersion: 1,
          position: [450, 300],
          parameters: {
            resource: 'chat',
            operation: 'create',
            model: 'gpt-4',
            messages: {
              values: [
                {
                  role: 'system',
                  content: `You are an AI assistant specialized in website generation and automation. ${prompt}`,
                },
                {
                  role: 'user',
                  content: '={{ $json.body.message || $json.body.prompt || $json.body }}',
                },
              ],
            },
            options: {
              temperature: 0.7,
              maxTokens: 2000,
            },
          },
        },
        {
          id: 'respond',
          name: 'Respond to Webhook',
          type: 'n8n-nodes-base.respondToWebhook',
          typeVersion: 1,
          position: [650, 300],
          parameters: {
            respondWith: 'json',
            responseBody: '={{ { "response": $json.choices[0].message.content, "model": $json.model } }}',
          },
        },
      ],
      connections: {
        Webhook: {
          main: [[{ node: 'OpenAI', type: 'main', index: 0 }]],
        },
        OpenAI: {
          main: [[{ node: 'Respond to Webhook', type: 'main', index: 0 }]],
        },
      },
      // Don't include 'active' field - it's read-only and set via separate API call
      settings: {},
    };
  }

  private async activateWorkflow(workflowId: string) {
    try {
      const cleanApiKey = N8N_KEY.trim().replace(/^["']|["']$/g, '');
      await axios.patch(
        `${N8N}/api/v1/workflows/${workflowId}`,
        { active: true },
        { headers: { 'X-N8N-API-KEY': cleanApiKey, 'Content-Type': 'application/json' } }
      );
      logInfo('n8n workflow activated', { workflowId });
    } catch (error: any) {
      logError('n8n workflow activation failed', error, { workflowId });
    }
  }

  private generateWebhookId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  getEmbedCode(workflowId: string): string {
    return this.buildEmbedCode(workflowId);
  }

  async deleteAgent(workflowId: string): Promise<void> {
    if (!isConfigured) {
      logInfo('n8n not configured, skipping agent deletion', { workflowId });
      return;
    }

    try {
      await axios.delete(
        `${N8N}/api/v1/workflows/${workflowId}`,
        { headers: { 'X-N8N-API-KEY': N8N_KEY } }
      );
      logInfo('n8n agent deleted', { workflowId });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logError('n8n deleteAgent error', error, { workflowId });
      throw new Error(`Failed to delete n8n agent: ${message}`);
    }
  }

  private buildEmbedCode(workflowId: string): string {
    const base = N8N || 'https://mock-n8n.example.com';
    // n8n webhook URLs typically follow: /webhook/{workflowId} or /webhook-test/{workflowId}
    const webhookUrl = `${base.replace(/\/$/, '')}/webhook/${workflowId}`;
    return `
<!-- Avallon AI Agent - Generated by n8n -->
<div id="avallon-agent-${workflowId}"></div>
<script>
  (function() {
    const agentId = '${workflowId}';
    const webhookUrl = '${webhookUrl}';
    
    // Create chat widget
    const chatWidget = document.createElement('div');
    chatWidget.id = 'avallon-chat-' + agentId;
    chatWidget.innerHTML = \`
      <div style="position:fixed;bottom:20px;right:20px;width:350px;height:500px;border:none;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,0.1);background:white;z-index:9999;">
        <iframe src="\${webhookUrl}" style="width:100%;height:100%;border:none;border-radius:10px;" frameborder="0"></iframe>
      </div>
    \`;
    document.body.appendChild(chatWidget);
  })();
</script>
`.trim();
  }
}

export function isN8nConfigured(): boolean {
  return isConfigured;
}
