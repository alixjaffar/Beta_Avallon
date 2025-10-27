// CHANGELOG: 2025-10-12 - Add provider status banners and plan gating for site creation
// CHANGELOG: 2024-12-19 - Add user sites listing and optimistic UI
"use client";
import { useState, useEffect } from "react";
import { ToastContainer } from "@/components/Toast";
import { ProviderBanner } from "@/components/ProviderBanner";
import { Toast, showSuccess, showError } from "@/lib/toast";

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

interface Site {
  id: string;
  name: string;
  slug: string;
  status: string;
  previewUrl?: string | null;
  vercelProjectId?: string | null;
  vercelDeploymentId?: string | null;
  createdAt: string;
}

export default function Sites() {
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"lovable" | "template">("lovable");
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [sitesLoading, setSitesLoading] = useState(true);
  const [providerStatus, setProviderStatus] = useState<ProviderStatus | null>(null);
  const [billing, setBilling] = useState<BillingSummary | null>(null);

  const addToast = (toast: Toast) => {
    setToasts(prev => [...prev, toast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [sitesRes, statusRes, usageRes] = await Promise.all([
          fetch('/api/sites'),
          fetch('/api/providers/status'),
          fetch('/api/billing/usage'),
        ]);

        if (sitesRes.ok) {
          const sitesJson = await sitesRes.json();
          setSites(sitesJson.sites || []);
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
        console.error('Failed to fetch sites:', error);
      } finally {
        setSitesLoading(false);
      }
    }
    fetchData();
  }, []);

  async function createSite() {
    if (!name.trim()) {
      addToast(showError("Error", "Please enter a project name"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/lovable/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mode }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        addToast(showError("Failed to create site", data.error || "Unknown error"));
        return;
      }

      addToast(showSuccess("Site created!", `Your site "${name}" is being built`));
      setName(""); // Reset form
      
      // Optimistically add the new site to the list
      const newSite: Site = {
        id: data.result.siteId,
        name,
        slug: data.result.slug,
        status: data.result.status,
        previewUrl: data.result.previewUrl,
        vercelProjectId: data.result.vercelProjectId ?? null,
        vercelDeploymentId: data.result.vercelDeploymentId ?? null,
        createdAt: new Date().toISOString(),
      };
      setSites(prev => [newSite, ...prev]);
      setBilling(prev => prev ? {
        ...prev,
        usage: {
          ...prev.usage,
          sites: prev.usage.sites + 1,
        },
      } : prev);
    } catch (error) {
      addToast(showError("Network error", "Failed to connect to server"));
  } finally {
      setLoading(false);
    }
  }

  const siteLimitReached = billing ? billing.usage.sites >= billing.limits.sites : false;
  const providersConfigured = providerStatus ? providerStatus.lovable && providerStatus.hosting : true;
  const disableCreate = loading || !name.trim() || siteLimitReached || !providersConfigured;

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-2xl font-bold">Websites</h1>
      
      {billing && (
        <div className="mt-3 rounded-xl border border-gray-200 bg-white px-5 py-4 text-sm text-gray-700">
          <div className="flex items-center justify-between">
            <span className="font-semibold uppercase tracking-wider text-gray-500">Plan</span>
            <span className="font-semibold text-gray-900">{billing.plan.toUpperCase()}</span>
          </div>
          <div className="mt-2 text-gray-600">
            {billing.usage.sites}/{billing.limits.sites} sites • {billing.usage.agents}/{billing.limits.agents} agents • {billing.usage.domains}/{billing.limits.domains} domains
          </div>
        </div>
      )}

      {providerStatus && (!providerStatus.lovable || !providerStatus.hosting) && (
        <div className="mt-4 space-y-2">
          {!providerStatus.lovable && (
            <ProviderBanner message="Lovable API keys missing. Site generation will return mocked content until configured." />
          )}
          {!providerStatus.hosting && (
            <ProviderBanner message="Vercel token missing. Hosting is mocked and deployments will not be created." />
          )}
        </div>
      )}
      
      {/* Create Site Form */}
      <div className="mt-6 rounded-xl border bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">Create New Site</h2>
        <div className="space-y-4">
          <input 
            className="w-full rounded-xl border p-3" 
            placeholder="Project name (e.g., Revan Studio)" 
            value={name} 
            onChange={e=>setName(e.target.value)}
            disabled={loading || siteLimitReached || !providersConfigured}
          />
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                checked={mode==="lovable"} 
                onChange={()=>setMode("lovable")}
                disabled={loading || siteLimitReached || !providersConfigured}
              /> 
              <span>Use Lovable (AI)</span>
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                checked={mode==="template"} 
                onChange={()=>setMode("template")}
                disabled={loading || siteLimitReached || !providersConfigured}
              /> 
              <span>Start from template</span>
            </label>
          </div>
          <button 
            disabled={disableCreate} 
            onClick={createSite} 
            className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating…" : "Create Site"}
          </button>
          {!providersConfigured && (
            <p className="text-sm text-yellow-700">
              Configure Lovable and Vercel credentials to launch new sites.
            </p>
          )}
          {siteLimitReached && billing && (
            <p className="text-sm text-red-600">
              Site limit reached for the {billing.plan} plan. Upgrade to create more sites.
            </p>
          )}
        </div>
      </div>

      {/* Sites List */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Your Sites</h2>
        {sitesLoading ? (
          <div className="text-center py-8 text-gray-500">Loading sites...</div>
        ) : sites.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No sites yet. Create your first site above!</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {sites.map((site) => (
              <div key={site.id} className="rounded-xl border bg-white p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{site.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    site.status === 'live' ? 'bg-green-100 text-green-800' :
                    site.status === 'building' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {site.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Slug: {site.slug}</p>
                {site.previewUrl && (
                  <a 
                    href={site.previewUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Preview →
                  </a>
                )}
                {site.vercelProjectId && (
                  <p className="mt-2 text-xs text-gray-500">Vercel project: {site.vercelProjectId}</p>
                )}
                {site.vercelDeploymentId && (
                  <p className="text-xs text-gray-500">Latest deployment: {site.vercelDeploymentId}</p>
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
