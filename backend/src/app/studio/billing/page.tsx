// CHANGELOG: 2025-10-12 - Add billing upgrade page with Stripe checkout hooks
"use client";
import { useEffect, useState } from "react";
import { ToastContainer } from "@/components/Toast";
import { Toast, showError, showInfo } from "@/lib/toast";

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

const PLAN_FEATURES: Record<"pro" | "business", { title: string; description: string; sites: number; agents: number; domains: number; email: number; price: Record<"monthly" | "yearly", string>; }> = {
  pro: {
    title: "Pro",
    description: "For growing teams launching a handful of sites.",
    sites: 3,
    agents: 3,
    domains: 1,
    email: 5,
    price: { monthly: "$49/mo", yearly: "$499/yr" },
  },
  business: {
    title: "Business",
    description: "For agencies managing multiple brands.",
    sites: 25,
    agents: 25,
    domains: 5,
    email: 50,
    price: { monthly: "$199/mo", yearly: "$1,999/yr" },
  },
};

export default function BillingPage() {
  const [billing, setBilling] = useState<BillingSummary | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const addToast = (toast: Toast) => setToasts(prev => [...prev, toast]);
  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  useEffect(() => {
    async function fetchBilling() {
      try {
        const res = await fetch("/api/billing/usage");
        if (res.ok) {
          const data = await res.json();
          setBilling(data as BillingSummary);
        }
      } catch (error) {
        console.error("Failed to load billing usage", error);
      }
    }
    fetchBilling();
  }, []);

  async function startCheckout(plan: "pro" | "business", interval: "monthly" | "yearly") {
    setCheckoutLoading(`${plan}-${interval}`);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval }),
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        addToast(showError("Unable to start checkout", data.error || "Unknown error"));
        return;
      }

      addToast(showInfo("Redirecting to Stripe", `Completing checkout for ${PLAN_FEATURES[plan].title} (${interval}).`));
      window.location.href = data.url as string;
    } catch (error) {
      addToast(showError("Checkout failed", "Please try again."));
    } finally {
      setCheckoutLoading(null);
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-2xl font-bold">Billing & Plans</h1>
      {billing && (
        <section className="mt-4 rounded-xl border border-gray-200 bg-white px-5 py-4 text-sm text-gray-700">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="font-semibold uppercase tracking-wider text-gray-500">Current Plan</span>
              <div className="text-lg font-semibold text-gray-900">{billing.plan.toUpperCase()}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 md:grid-cols-4">
              <UsagePill label="Sites" usage={billing.usage.sites} limit={billing.limits.sites} />
              <UsagePill label="Agents" usage={billing.usage.agents} limit={billing.limits.agents} />
              <UsagePill label="Domains" usage={billing.usage.domains} limit={billing.limits.domains} />
              <UsagePill label="Email" usage={billing.usage.emailAccounts} limit={billing.limits.emailAccounts} />
            </div>
          </div>
        </section>
      )}

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        {Object.entries(PLAN_FEATURES).map(([planKey, plan]) => {
          const key = planKey as "pro" | "business";
          return (
            <div key={key} className="flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{plan.title}</h2>
                <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  <li>✅ {plan.sites} sites</li>
                  <li>✅ {plan.agents} AI agents</li>
                  <li>✅ {plan.domains} managed domains</li>
                  <li>✅ {plan.email} email inboxes</li>
                </ul>
              </div>
              <div className="mt-6 space-y-3">
                <BillingButton
                  label={`Pay ${plan.price.monthly}`}
                  onClick={() => startCheckout(key, "monthly")}
                  loading={checkoutLoading === `${key}-monthly`}
                />
                <BillingButton
                  label={`Pay ${plan.price.yearly}`}
                  sublabel="Save 2 months"
                  onClick={() => startCheckout(key, "yearly")}
                  loading={checkoutLoading === `${key}-yearly`}
                />
              </div>
            </div>
          );
        })}
      </section>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </main>
  );
}

function UsagePill({ label, usage, limit }: { label: string; usage: number; limit: number }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-center">
      <div className="text-xs font-semibold text-gray-500">{label}</div>
      <div className="text-sm font-semibold text-gray-800">{usage}/{limit}</div>
    </div>
  );
}

function BillingButton({ label, sublabel, onClick, loading }: { label: string; sublabel?: string; onClick: () => void; loading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full rounded-xl bg-black px-4 py-3 text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <div className="flex flex-col items-center">
        <span className="text-sm font-semibold">{loading ? "Redirecting…" : label}</span>
        {sublabel && <span className="text-xs text-gray-300">{sublabel}</span>}
      </div>
    </button>
  );
}
