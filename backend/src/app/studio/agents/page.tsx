// CHANGELOG: 2025-10-12 - Add provider status gating and embed snippet display for agents
// CHANGELOG: 2025-10-10 - List user's agents with statuses
// CHANGELOG: 2024-12-19 - Add loading states, error handling, and toast notifications
"use client";
import { useEffect, useState } from "react";
import { ToastContainer } from "@/components/Toast";
import { Toast, showSuccess, showError } from "@/lib/toast";
import { ProviderBanner } from "@/components/ProviderBanner";

type ProviderStatus = {
  lovable: boolean;
  hosting: boolean;
  n8n: boolean;
  registrar: boolean;
  email: boolean;
};

type BillingSummary = {
  plan: string;
  limits: {
    sites: number;
    agents: number;
    domains: number;
    emailAccounts: number;
    customDomains: boolean;
  };
  usage: {
    sites: number;
    agents: number;
    domains: number;
    emailAccounts: number;
  };
};

type Agent = {
  id: string;
  name: string;
  status: string;
  n8nId?: string | null;
  embedCode?: string | null;
  createdAt: string;
};

export default function Agents() {
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("You are a helpful website assistant.");
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(true);
  const [providerStatus, setProviderStatus] = useState<ProviderStatus | null>(null);
  const [billing, setBilling] = useState<BillingSummary | null>(null);
  const [copyingId, setCopyingId] = useState<string | null>(null);

  const addToast = (toast: Toast) => {
    setToasts(prev => [...prev, toast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [agentsRes, statusRes, usageRes] = await Promise.all([
          fetch('/api/n8n/agents'),
          fetch('/api/providers/status'),
          fetch('/api/billing/usage'),
        ]);

        if (agentsRes.ok) {
          const agentJson = await agentsRes.json();
          setAgents(agentJson.agents || []);
        }

        if (statusRes.ok) {
          const statusJson = await statusRes.json();
          setProviderStatus(statusJson.status as ProviderStatus);
        }

        if (usageRes.ok) {
          const usageJson = await usageRes.json();
          setBilling(usageJson as BillingSummary);
        }
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      } finally {
        setAgentsLoading(false);
      }
    }
    fetchData();
  }, []);

  async function createAgent() {
    if (!name.trim()) {
      addToast(showError("Error", "Please enter an agent name"));
      return;
    }

    if (!prompt.trim()) {
      addToast(showError("Error", "Please enter a prompt"));
      return;
    }

    if (!providersConfigured) {
      addToast(showError("Provider not configured", "Configure the n8n provider before creating agents."));
      return;
    }

    if (agentLimitReached && billing) {
      addToast(showError("Limit reached", `You have reached the agent limit for the ${billing.plan} plan.`));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/n8n/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, prompt }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        addToast(showError("Failed to create agent", data.error || "Unknown error"));
        return;
      }

      addToast(showSuccess("Agent created!", `Your agent "${name}" is now active`));
      setName(""); // Reset form
      setPrompt("You are a helpful website assistant.");

      // Optimistically add agent
      setAgents(prev => [{
        id: data.result.agentId,
        name,
        status: 'active',
        n8nId: data.result.n8nId,
        embedCode: data.result.embedCode,
        createdAt: new Date().toISOString(),
      }, ...prev]);
      setBilling(prev => prev ? {
        ...prev,
        usage: {
          ...prev.usage,
          agents: prev.usage.agents + 1,
        },
      } : prev);
    } catch (error) {
      addToast(showError("Network error", "Failed to connect to server"));
    } finally {
      setLoading(false);
    }
  }

  const agentLimitReached = billing ? billing.usage.agents >= billing.limits.agents : false;
  const providersConfigured = providerStatus ? providerStatus.n8n : true;
  const disableCreate = loading || !name.trim() || !prompt.trim() || agentLimitReached || !providersConfigured;

  async function copyEmbed(agentId: string, embed?: string | null) {
    if (!embed) {
      return;
    }
    try {
      setCopyingId(agentId);
      await navigator.clipboard.writeText(embed);
      addToast(showSuccess("Embed copied", "Embed snippet copied to clipboard."));
    } catch (error) {
      addToast(showError("Copy failed", "Unable to copy embed snippet."));
    } finally {
      setCopyingId(null);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-bold">AI Agents</h1>
      {billing && (
        <div className="mt-3 rounded-xl border border-gray-200 bg-white px-5 py-4 text-sm text-gray-700">
          <div className="flex items-center justify-between">
            <span className="font-semibold uppercase tracking-wider text-gray-500">Plan</span>
            <span className="font-semibold text-gray-900">{billing.plan.toUpperCase()}</span>
          </div>
          <div className="mt-2 text-gray-600">
            {billing.usage.agents}/{billing.limits.agents} agents • {billing.usage.sites}/{billing.limits.sites} sites
          </div>
        </div>
      )}
      {providerStatus && !providerStatus.n8n && (
        <div className="mt-4">
          <ProviderBanner message="n8n credentials missing. Agent workflows will be mocked until configured." />
        </div>
      )}
      <div className="mt-6 space-y-4">
        <input 
          className="w-full rounded-xl border p-3" 
          placeholder="Agent name (e.g., Revan Helper)" 
          value={name} 
          onChange={e=>setName(e.target.value)}
          disabled={loading || !providersConfigured || agentLimitReached}
        />
        <textarea 
          className="w-full rounded-xl border p-3" 
          rows={6} 
          value={prompt} 
          onChange={e=>setPrompt(e.target.value)}
          disabled={loading || !providersConfigured || agentLimitReached}
          placeholder="Describe what this agent should do..."
        />
        <button 
          disabled={disableCreate} 
          onClick={createAgent} 
          className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating…" : "Create Agent"}
        </button>
        {!providersConfigured && (
          <p className="text-sm text-yellow-700">
            Configure n8n provider settings to create new agents.
          </p>
        )}
        {agentLimitReached && billing && (
          <p className="text-sm text-red-600">
            Agent limit reached for the {billing.plan} plan. Upgrade for additional agents.
          </p>
        )}
      </div>
      
      {/* Agents List */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Your Agents</h2>
        {agentsLoading ? (
          <div className="text-center py-8 text-gray-500">Loading agents...</div>
        ) : agents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No agents yet. Create your first agent above!</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {agents.map((agent) => (
              <div key={agent.id} className="rounded-xl border bg-white p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{agent.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    agent.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {agent.status}
                  </span>
                </div>
                {agent.n8nId && (
                  <p className="text-sm text-gray-600">n8n ID: {agent.n8nId}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Created {new Date(agent.createdAt).toLocaleDateString()}
                </p>
                {agent.embedCode && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Embed snippet</span>
                      <button
                        className="rounded-md border px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                        onClick={() => copyEmbed(agent.id, agent.embedCode)}
                        disabled={copyingId === agent.id}
                      >
                        {copyingId === agent.id ? "Copying…" : "Copy"}
                      </button>
                    </div>
                    <pre className="mt-1 max-h-48 overflow-auto rounded-lg bg-gray-900 p-3 text-[11px] text-gray-100">{agent.embedCode}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </main>
  );
}
