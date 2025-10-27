// CHANGELOG: 2025-10-12 - Return embed code when creating agents
// CHANGELOG: 2025-10-11 - Enhance n8n provider with mocking and better workflow structure
// CHANGELOG: 2025-10-10 - Add n8n AgentProvider implementation
import axios from 'axios';
import type { AgentProvider, CreateAgentInput, CreateAgentResult } from '@/lib/providers/agents';
import { logError, logInfo } from '@/lib/log';

const N8N = process.env.N8N_BASE_URL || '';
const N8N_KEY = process.env.N8N_API_KEY || '';

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
      
      const response = await axios.post(
        `${N8N}/api/v1/workflows`,
        workflow,
        { headers: { 'X-N8N-API-KEY': N8N_KEY, 'Content-Type': 'application/json' } }
      );

      const rawId = response.data?.id ?? response.data?.workflowId ?? response.data?.data?.id;
      const workflowId = rawId ? String(rawId) : this.generateWebhookId();
      
      // Activate the workflow only when we have a real ID
      if (rawId) {
        await this.activateWorkflow(workflowId);
      }

      logInfo('n8n agent created', { workflowId, name: input.name });
      return { externalId: workflowId, embedCode: this.buildEmbedCode(workflowId) };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logError('n8n createAgent error', error, input);
      throw new Error(`Failed to create n8n agent: ${message}`);
    }
  }

  private buildAIAgentWorkflow(name: string, prompt: string) {
    return {
      name,
      nodes: [
        {
          parameters: {},
          name: 'Webhook',
          type: 'n8n-nodes-base.webhook',
          typeVersion: 1,
          position: [250, 300],
          webhookId: this.generateWebhookId(),
        },
        {
          parameters: {
            model: 'gpt-4',
            prompt: `You are an AI assistant. ${prompt}`,
            options: {},
          },
          name: 'OpenAI',
          type: 'n8n-nodes-base.openAi',
          typeVersion: 1,
          position: [450, 300],
        },
        {
          parameters: {
            respondWith: 'json',
            responseBody: '={{ $json }}',
          },
          name: 'Respond to Webhook',
          type: 'n8n-nodes-base.respondToWebhook',
          typeVersion: 1,
          position: [650, 300],
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
      active: false,
      settings: {},
    };
  }

  private async activateWorkflow(workflowId: string) {
    try {
      await axios.patch(
        `${N8N}/api/v1/workflows/${workflowId}`,
        { active: true },
        { headers: { 'X-N8N-API-KEY': N8N_KEY, 'Content-Type': 'application/json' } }
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

  private buildEmbedCode(workflowId: string): string {
    const base = N8N || 'https://mock-n8n.example.com';
    const webhookUrl = `${base.replace(/\/$/, '')}/webhook/${workflowId}`;
    return `
<!-- Avallon AI Agent -->
<script>
  (function() {
    const chatWidget = document.createElement('div');
    chatWidget.id = 'avallon-chat';
    chatWidget.innerHTML = '<iframe src="${webhookUrl}" style="position:fixed;bottom:20px;right:20px;width:350px;height:500px;border:none;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,0.1);"></iframe>';
    document.body.appendChild(chatWidget);
  })();
</script>
`.trim();
  }
}

export function isN8nConfigured(): boolean {
  return isConfigured;
}
