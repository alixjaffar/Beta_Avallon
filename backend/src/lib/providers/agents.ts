// CHANGELOG: 2025-10-12 - Expose embed code helper on AgentProvider
// CHANGELOG: 2025-10-12 - Return embed code from AgentProvider
// CHANGELOG: 2025-10-10 - Add AgentProvider interface

export type CreateAgentInput = {
  name: string;
  prompt: string;
  activate?: boolean; // Whether to activate the workflow immediately (default: true)
};

export type CreateAgentResult = {
  externalId: string;
  embedCode: string;
};

export interface AgentProvider {
  createAgent(input: CreateAgentInput): Promise<CreateAgentResult>;
  getEmbedCode(externalId: string): string;
  deleteAgent(externalId: string): Promise<void>;
}
