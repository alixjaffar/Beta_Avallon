// CHANGELOG: 2025-01-15 - Add n8n API client infrastructure for AI voice agents
import axios from 'axios';

export interface N8nConfig {
  baseUrl: string;
  apiKey: string;
  webhookUrl?: string;
}

export interface WorkflowDefinition {
  name: string;
  nodes: Array<{
    id: string;
    name: string;
    type: string;
    typeVersion: number;
    position: [number, number];
    parameters: Record<string, any>;
  }>;
  connections: Record<string, any>;
  active: boolean;
  settings?: Record<string, any>;
}

export interface VoiceAgentConfig {
  name: string;
  description: string;
  voice: {
    provider: 'elevenlabs' | 'openai' | 'azure';
    voiceId: string;
    model?: string;
  };
  language: string;
  personality: string;
  capabilities: string[];
  webhookUrl?: string;
}

export interface AgentTrigger {
  agentId: string;
  input: {
    message?: string;
    audio?: string;
    context?: Record<string, any>;
  };
}

export class N8nClient {
  private config: N8nConfig;

  constructor(config: N8nConfig) {
    this.config = config;
  }

  /**
   * Deploy a new AI voice agent workflow
   */
  async deployVoiceAgent(config: VoiceAgentConfig): Promise<{
    workflowId: string;
    webhookUrl: string;
    status: string;
  }> {
    try {
      const workflowDefinition: WorkflowDefinition = {
        name: `AI Voice Agent - ${config.name}`,
        nodes: [
          {
            id: 'webhook',
            name: 'Webhook',
            type: 'n8n-nodes-base.webhook',
            typeVersion: 1,
            position: [240, 300],
            parameters: {
              path: `voice-agent-${config.name.toLowerCase().replace(/\s+/g, '-')}`,
              httpMethod: 'POST',
            },
          },
          {
            id: 'voiceProcessor',
            name: 'Voice Processor',
            type: 'n8n-nodes-base.function',
            typeVersion: 1,
            position: [460, 300],
            parameters: {
              functionCode: this.generateVoiceProcessorCode(config),
            },
          },
          {
            id: 'aiResponse',
            name: 'AI Response Generator',
            type: 'n8n-nodes-base.openAi',
            typeVersion: 1,
            position: [680, 300],
            parameters: {
              resource: 'chat',
              operation: 'create',
              model: 'gpt-4',
              messages: {
                values: [
                  {
                    role: 'system',
                    content: `You are ${config.name}, an AI voice assistant. ${config.description}. Personality: ${config.personality}. Capabilities: ${config.capabilities.join(', ')}.`,
                  },
                  {
                    role: 'user',
                    content: '={{ $json.message }}',
                  },
                ],
              },
            },
          },
          {
            id: 'voiceSynthesis',
            name: 'Voice Synthesis',
            type: 'n8n-nodes-base.function',
            typeVersion: 1,
            position: [900, 300],
            parameters: {
              functionCode: this.generateVoiceSynthesisCode(config),
            },
          },
          {
            id: 'response',
            name: 'Response',
            type: 'n8n-nodes-base.respondToWebhook',
            typeVersion: 1,
            position: [1120, 300],
            parameters: {
              responseBody: '={{ $json }}',
            },
          },
        ],
        connections: {
          webhook: {
            main: [
              [
                {
                  node: 'voiceProcessor',
                  type: 'main',
                  index: 0,
                },
              ],
            ],
          },
          voiceProcessor: {
            main: [
              [
                {
                  node: 'aiResponse',
                  type: 'main',
                  index: 0,
                },
              ],
            ],
          },
          aiResponse: {
            main: [
              [
                {
                  node: 'voiceSynthesis',
                  type: 'main',
                  index: 0,
                },
              ],
            ],
          },
          voiceSynthesis: {
            main: [
              [
                {
                  node: 'response',
                  type: 'main',
                  index: 0,
                },
              ],
            ],
          },
        },
        active: true,
        settings: {
          executionOrder: 'v1',
        },
      };

      // Deploy workflow to n8n
      const response = await axios.post(
        `${this.config.baseUrl}/api/v1/workflows`,
        workflowDefinition,
        {
          headers: {
            'X-N8N-API-KEY': this.config.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      const workflowId = response.data.id;
      const webhookUrl = `${this.config.baseUrl}/webhook/voice-agent-${config.name.toLowerCase().replace(/\s+/g, '-')}`;

      return {
        workflowId,
        webhookUrl,
        status: 'active',
      };
    } catch (error) {
      console.error('n8n deployment error:', error);
      throw new Error('Failed to deploy voice agent');
    }
  }

  /**
   * Trigger a voice agent
   */
  async triggerVoiceAgent(trigger: AgentTrigger): Promise<{
    success: boolean;
    response?: string;
    audioUrl?: string;
  }> {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/webhook/voice-agent-${trigger.agentId}`,
        trigger.input,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        response: response.data.response,
        audioUrl: response.data.audioUrl,
      };
    } catch (error) {
      console.error('n8n trigger error:', error);
      throw new Error('Failed to trigger voice agent');
    }
  }

  /**
   * Get workflow status
   */
  async getWorkflowStatus(workflowId: string): Promise<{
    id: string;
    name: string;
    active: boolean;
    lastExecuted?: string;
    executions: number;
  }> {
    try {
      const response = await axios.get(
        `${this.config.baseUrl}/api/v1/workflows/${workflowId}`,
        {
          headers: {
            'X-N8N-API-KEY': this.config.apiKey,
          },
        }
      );

      return {
        id: response.data.id,
        name: response.data.name,
        active: response.data.active,
        lastExecuted: response.data.updatedAt,
        executions: response.data.stats?.totalExecutions || 0,
      };
    } catch (error) {
      console.error('n8n status error:', error);
      throw new Error('Failed to get workflow status');
    }
  }

  /**
   * Deactivate a workflow
   */
  async deactivateWorkflow(workflowId: string): Promise<{ success: boolean }> {
    try {
      await axios.patch(
        `${this.config.baseUrl}/api/v1/workflows/${workflowId}`,
        { active: false },
        {
          headers: {
            'X-N8N-API-KEY': this.config.apiKey,
          },
        }
      );

      return { success: true };
    } catch (error) {
      console.error('n8n deactivation error:', error);
      throw new Error('Failed to deactivate workflow');
    }
  }

  /**
   * Generate voice processor code for n8n function node
   */
  private generateVoiceProcessorCode(config: VoiceAgentConfig): string {
    return `
// Voice processing function for ${config.name}
const input = $input.all();

// Process incoming voice data
const processedData = input.map(item => {
  const { message, audio, context } = item.json;
  
  return {
    message: message || 'Hello, how can I help you?',
    audio: audio,
    context: context || {},
    agentConfig: {
      name: '${config.name}',
      voice: '${config.voice.voiceId}',
      language: '${config.language}',
      personality: '${config.personality}'
    }
  };
});

return processedData;
    `.trim();
  }

  /**
   * Generate voice synthesis code for n8n function node
   */
  private generateVoiceSynthesisCode(config: VoiceAgentConfig): string {
    return `
// Voice synthesis function for ${config.name}
const input = $input.all();

const synthesizedData = input.map(item => {
  const { response } = item.json;
  
  // Here you would integrate with voice synthesis services
  // like ElevenLabs, Azure Speech, or OpenAI TTS
  const audioUrl = \`https://api.elevenlabs.io/v1/text-to-speech/${config.voice.voiceId}\`;
  
  return {
    response: response,
    audioUrl: audioUrl,
    voiceId: '${config.voice.voiceId}',
    provider: '${config.voice.provider}'
  };
});

return synthesizedData;
    `.trim();
  }
}

// Factory function to create n8n client
export function createN8nClient(config: N8nConfig): N8nClient {
  return new N8nClient(config);
}