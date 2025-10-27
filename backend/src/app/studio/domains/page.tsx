// CHANGELOG: 2025-10-12 - Add provider gating, usage awareness, and DNS insights
// CHANGELOG: 2025-10-10 - List domains, add Verify DNS and default DNS actions, show tips
// CHANGELOG: 2024-12-19 - Add loading states, error handling, and toast notifications
"use client";
import { useEffect, useState } from "react";
import { ToastContainer } from "@/components/Toast";
import { Toast, showSuccess, showError, showInfo } from "@/lib/toast";
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

type DomainRecord = {
  id: string;
  domain: string;
  status: string;
  createdAt: string;
  siteId?: string | null;
};

type DnsInsight = {
  registrar?: {
    verified: boolean;
    records?: { type: string; name: string; value: string }[];
  };
  email?: {
    verified: boolean;
    records?: { type: string; name: string; value: string; status?: string }[];
  };
};

export default function Domains() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [domains, setDomains] = useState<DomainRecord[]>([]);
  const [sites, setSites] = useState<Array<{ id: string; name: string }>>([]);
  const [domainsLoading, setDomainsLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [settingDns, setSettingDns] = useState<string | null>(null);
  const [emailVerifying, setEmailVerifying] = useState<string | null>(null);
  const [providerStatus, setProviderStatus] = useState<ProviderStatus | null>(null);
  const [billing, setBilling] = useState<BillingSummary | null>(null);
  const [dnsInsights, setDnsInsights] = useState<Record<string, DnsInsight>>({});

  const registrarConfigured = providerStatus?.registrar || false;
  const emailProviderConfigured = providerStatus?.email || false;
  const domainLimitReached = billing ? billing.usage.domains >= billing.limits.domains : false;
  const emailLimitReached = billing ? billing.usage.emailAccounts >= billing.limits.emailAccounts : false;

  const addToast = (toast: Toast) => {
    setToasts(prev => [...prev, toast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [domainsRes, sitesRes, statusRes, usageRes] = await Promise.all([
          fetch('/api/domains'),
          fetch('/api/sites'),
          fetch('/api/providers/status'),
          fetch('/api/billing/usage'),
        ]);

        if (domainsRes.ok) {
          const domainJson = await domainsRes.json();
          setDomains(domainJson.domains || []);
        }

        if (sitesRes.ok) {
          const sitesJson = await sitesRes.json();
          setSites((sitesJson.sites || []).map((s: any) => ({ id: s.id, name: s.name })));
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
        console.error('Failed to fetch domains data:', error);
      } finally {
        setDomainsLoading(false);
      }
    }
    fetchData();
  }, []);

  async function purchase() {
    if (!domain.trim()) {
      addToast(showError("Error", "Please enter a domain name"));
      return;
    }

    if (!registrarConfigured) {
      addToast(showError("Provider not configured", "Configure your registrar provider to purchase domains."));
      return;
    }

    if (domainLimitReached && billing) {
      addToast(showError("Limit reached", `You have reached the domain limit for the ${billing.plan} plan.`));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/domains/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        addToast(showError("Failed to purchase domain", data.error || "Unknown error"));
        return;
      }

      addToast(showSuccess("Domain purchase initiated!", `Processing ${domain}`));
      setDomain(""); // Reset form

      // Optimistically add domain in pending/active state
      const result = data.result as { domainId: string; domain: string; status: string };
      setDomains(prev => {
        const filtered = prev.filter(existing => existing.domain !== result.domain);
        return [{
          id: result.domainId,
          domain: result.domain,
          status: result.status,
          createdAt: new Date().toISOString(),
        }, ...filtered];
      });
      setBilling(prev => prev ? {
        ...prev,
        usage: {
          ...prev.usage,
          domains: prev.usage.domains + 1,
        },
      } : prev);
      setDnsInsights(prev => ({
        ...prev,
        [result.domain]: prev[result.domain] || {},
      }));
    } catch (error) {
      addToast(showError("Network error", "Failed to connect to server"));
    } finally {
      setLoading(false);
    }
  }

  async function verifyDNS(d: { id: string; domain: string }) {
    try {
      setVerifying(d.id);
      const res = await fetch('/api/domains/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: d.domain }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(showError('Verification failed', data.error || 'Unknown error'));
        return;
      }
      setDomains(prev => prev.map(x => x.id === d.id ? { ...x, status: data.result?.status || 'active' } : x));
      setDnsInsights(prev => ({
        ...prev,
        [d.domain]: {
          registrar: data.result?.registrar,
          email: data.result?.email,
        },
      }));
      addToast(showSuccess(
        data.result?.registrar?.verified ? 'Domain verified' : 'Domain verification pending',
        `${d.domain} ${data.result?.registrar?.verified ? 'is active' : 'still requires DNS propagation'}`
      ));
    } catch (e) {
      addToast(showError('Network error', 'Failed to verify DNS'));
    } finally {
      setVerifying(null);
    }
  }

  async function setDefaultDNS(d: { id: string; domain: string }) {
    try {
      setSettingDns(d.id);
      const res = await fetch('/api/domains/set-default', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: d.domain }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(showError('Failed to set DNS', data.error || 'Unknown error'));
        return;
      }
      addToast(showSuccess('DNS set', `Default records applied for ${d.domain}`));
    } catch (e) {
      addToast(showError('Network error', 'Failed to set DNS'));
    } finally {
      setSettingDns(null);
    }
  }

  async function verifyEmailDns(d: { id: string; domain: string }) {
    try {
      setEmailVerifying(d.id);
      const res = await fetch('/api/email/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: d.domain }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(showError('Email verification failed', data.error || 'Unknown error'));
        return;
      }
      setDnsInsights(prev => ({
        ...prev,
        [d.domain]: {
          ...(prev[d.domain] || {}),
          email: data.result,
        },
      }));
      addToast(showInfo(
        data.result?.verified ? 'Email domain verified' : 'Email domain pending',
        data.result?.verified
          ? `Email records for ${d.domain} are verified.`
          : `Email records for ${d.domain} still require updates.`
      ));
    } catch (e) {
      addToast(showError('Network error', 'Failed to verify email DNS'));
    } finally {
      setEmailVerifying(null);
    }
  }

  async function createEmail() {
    if (!domain.trim()) {
      addToast(showError("Error", "Please enter a domain name"));
      return;
    }

    if (!emailProviderConfigured) {
      addToast(showError("Provider not configured", "Configure your email provider to provision inboxes."));
      return;
    }

    if (emailLimitReached && billing) {
      addToast(showError("Limit reached", `You have reached the email inbox limit for the ${billing.plan} plan.`));
      return;
    }

    setEmailLoading(true);
    try {
      const res = await fetch("/api/email/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, inbox: "hello" }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        addToast(showError("Failed to create email", data.error || "Unknown error"));
        return;
      }

      addToast(showSuccess("Email created!", `hello@${domain} is ready`));
      setBilling(prev => prev ? {
        ...prev,
        usage: {
          ...prev.usage,
          emailAccounts: prev.usage.emailAccounts + 1,
        },
      } : prev);
    } catch (error) {
      addToast(showError("Network error", "Failed to connect to server"));
    } finally {
      setEmailLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-bold">Domains & Email</h1>
      {billing && (
        <div className="mt-3 rounded-xl border border-gray-200 bg-white px-5 py-4 text-sm text-gray-700">
          <div className="flex items-center justify-between">
            <span className="font-semibold uppercase tracking-wider text-gray-500">Plan</span>
            <span className="font-semibold text-gray-900">{billing.plan.toUpperCase()}</span>
          </div>
          <div className="mt-2 text-gray-600">
            {billing.usage.domains}/{billing.limits.domains} domains • {billing.usage.emailAccounts}/{billing.limits.emailAccounts} inboxes
          </div>
        </div>
      )}
      {providerStatus && (
        <div className="mt-4 space-y-2">
          {!providerStatus.registrar && (
            <ProviderBanner message="Namecheap credentials missing. Domain purchasing will be mocked until configured." />
          )}
          {!providerStatus.email && (
            <ProviderBanner message="Zoho Mail credentials missing. Email provisioning will be mocked until configured." />
          )}
          {!providerStatus.hosting && (
            <ProviderBanner message="Vercel credentials missing. Attaching custom domains to sites will be mocked until configured." />
          )}
        </div>
      )}
      <div className="mt-6 space-y-4">
        <input 
          className="w-full rounded-xl border p-3" 
          placeholder="yourbrand.com" 
          value={domain} 
          onChange={e=>setDomain(e.target.value)}
          disabled={loading || emailLoading}
        />
        <div className="flex gap-3">
          <button 
            disabled={loading || emailLoading || !domain.trim() || domainLimitReached || !registrarConfigured} 
            onClick={purchase} 
            className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Purchasing…" : "Buy Domain"}
          </button>
          <button 
            disabled={loading || emailLoading || !domain.trim() || !emailProviderConfigured || emailLimitReached} 
            onClick={createEmail} 
            className="rounded-xl border px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {emailLoading ? "Creating…" : "Create hello@ Inbox"}
          </button>
        </div>
        {!registrarConfigured && (
          <p className="text-sm text-yellow-700">
            Configure your registrar credentials to purchase domains.
          </p>
        )}
        {domainLimitReached && billing && (
          <p className="text-sm text-red-600">
            Domain limit reached for the {billing.plan} plan. Upgrade to add more domains.
          </p>
        )}
        {!emailProviderConfigured && (
          <p className="text-sm text-yellow-700">
            Configure your email provider before provisioning inboxes.
          </p>
        )}
        {emailLimitReached && billing && (
          <p className="text-sm text-red-600">
            Email inbox limit reached for the {billing.plan} plan.
          </p>
        )}
        <p className="text-sm text-gray-600">
          Note: Domain must be purchased and active before creating email inboxes.
        </p>
      </div>
      
      {/* Domains List */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Your Domains</h2>
        {domainsLoading ? (
          <div className="text-center py-8 text-gray-500">Loading domains...</div>
        ) : domains.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No domains yet. Purchase your first domain above!</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {domains.map((d) => {
              const insight = dnsInsights[d.domain];
              return (
                <div key={d.id} className="rounded-xl border bg-white p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{d.domain}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    d.status === 'active' ? 'bg-green-100 text-green-800' : d.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {d.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                    disabled={!registrarConfigured || verifying === d.id || d.status === 'active'}
                    onClick={() => verifyDNS(d)}
                  >
                    {verifying === d.id ? 'Verifying…' : 'Verify DNS'}
                  </button>
                  <button
                    className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                    disabled={!registrarConfigured || settingDns === d.id}
                    onClick={() => setDefaultDNS(d)}
                  >
                    {settingDns === d.id ? 'Applying…' : 'Set Default DNS'}
                  </button>
                  <button
                    className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                    disabled={emailVerifying === d.id || !emailProviderConfigured}
                    onClick={() => verifyEmailDns(d)}
                  >
                    {emailVerifying === d.id ? 'Checking…' : 'Check Email DNS'}
                  </button>
                  <div className="ml-auto flex items-center gap-2">
                    <select
                      className="rounded-md border px-2 py-1 text-sm"
                      value={d.siteId || ''}
                      onChange={(e) => {
                        const siteId = e.target.value || null;
                        setDomains(prev => prev.map(x => x.id === d.id ? { ...x, siteId } : x));
                      }}
                    >
                      <option value="">No site</option>
                      {sites.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <button
                      className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                      disabled={!d.siteId || (providerStatus ? !providerStatus.hosting : false)}
                      onClick={async () => {
                        try {
                          const res = await fetch('/api/domains/connect', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ domain: d.domain, siteId: d.siteId }),
                          });
                          const data = await res.json();
                          if (!res.ok) {
                            addToast(showError('Failed to connect', data.error || 'Unknown error'));
                            return;
                          }
                          addToast(showSuccess('Connected', `${d.domain} connected to site`));
                        } catch (e) {
                          addToast(showError('Network error', 'Failed to connect domain'));
                        }
                      }}
                    >
                      Connect
                    </button>
                  </div>
                </div>
                {insight?.registrar?.records && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-700">Registrar DNS</p>
                    <p className="text-xs text-gray-500">Status: {insight.registrar?.verified ? 'Verified' : 'Pending'}</p>
                    <ul className="mt-1 space-y-1 text-xs text-gray-600">
                      {insight.registrar.records.map((record, idx) => (
                        <li key={`${record.type}-${record.name}-${idx}`}>
                          <span className="font-mono text-gray-800">{record.type}</span> {record.name} → {record.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {insight?.email?.records && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-700">Email DNS</p>
                    <p className="text-xs text-gray-500">Status: {insight.email?.verified ? 'Verified' : 'Pending'}</p>
                    <ul className="mt-1 space-y-1 text-xs text-gray-600">
                      {insight.email.records.map((record, idx) => (
                        <li key={`email-${record.type}-${record.name}-${idx}`}>
                          <span className="font-mono text-gray-800">{record.type}</span> {record.name} → {record.value}
                          {record.status && (
                            <span className="ml-2 text-gray-500">({record.status})</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DNS Guidance */}
      <div className="mt-8 rounded-xl border bg-white p-6">
        <h2 className="text-lg font-semibold mb-3">DNS Setup Tips</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p className="font-medium">Website</p>
          <ul className="list-disc pl-5">
            <li>A @ → 76.76.21.21</li>
            <li>CNAME www → cname.vercel-dns.com</li>
          </ul>
          <p className="font-medium mt-4">Email (placeholders)</p>
          <ul className="list-disc pl-5">
            <li>SPF/TXT: v=spf1 include:spf.email-provider.example ~all</li>
            <li>DKIM/CNAME: selector._domainkey → dkim.email-provider.example</li>
          </ul>
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </main>
  );
}
