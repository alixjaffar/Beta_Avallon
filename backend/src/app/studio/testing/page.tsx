// CHANGELOG: 2025-10-12 - Add studio testing dashboard for provider status and usage
import Link from "next/link";

type ProviderStatus = {
  lovable: boolean;
  hosting: boolean;
  registrar: boolean;
  email: boolean;
  n8n: boolean;
};

type UsageResponse = {
  plan: string;
  limits: {
    sites: number;
    agents: number;
    domains: number;
    emailAccounts: number;
  };
  usage: {
    sites: number;
    agents: number;
    domains: number;
    emailAccounts: number;
  };
};

async function getProviderStatus(): Promise<ProviderStatus | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/providers/status`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.status as ProviderStatus;
  } catch {
    return null;
  }
}

async function getUsage(): Promise<UsageResponse | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/billing/usage`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as UsageResponse;
  } catch {
    return null;
  }
}

function booleanBadge(flag: boolean) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        flag ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {flag ? "Configured" : "Missing"}
    </span>
  );
}

export default async function TestingDashboard() {
  const [providerStatus, usage] = await Promise.all([getProviderStatus(), getUsage()]);

  return (
    <main className="mx-auto max-w-4xl space-y-8 p-8">
      <header>
        <h1 className="text-3xl font-bold">Testing Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Handy overview for validating provider wiring, plan limits, and cron jobs without touching customer data.
        </p>
      </header>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Provider Configuration</h2>
          <Link href="/studio/sites" className="text-sm font-semibold text-blue-600 hover:underline">
            Open Studio →
          </Link>
        </div>
        {providerStatus ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {Object.entries(providerStatus).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between rounded-lg border px-4 py-3">
                <span className="font-medium text-gray-700">{key.toUpperCase()}</span>
                {booleanBadge(value)}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-red-600">Unable to load provider status. Verify your API routes.</p>
        )}
      </section>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Billing Usage</h2>
          <Link href="/studio/billing" className="text-sm font-semibold text-blue-600 hover:underline">
            Manage Plans →
          </Link>
        </div>
        {usage ? (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between rounded-lg border px-4 py-3">
              <span className="text-sm font-medium text-gray-700">Current Plan</span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold uppercase">
                {usage.plan}
              </span>
            </div>
            <table className="w-full table-fixed border-collapse overflow-hidden rounded-lg border text-sm">
              <thead className="bg-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Resource</th>
                  <th className="px-4 py-3">Usage</th>
                  <th className="px-4 py-3">Limit</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(usage.usage).map(([resource, value]) => (
                  <tr key={resource} className="border-t">
                    <td className="px-4 py-3 font-medium capitalize text-gray-700">{resource}</td>
                    <td className="px-4 py-3">{value}</td>
                    <td className="px-4 py-3">{usage.limits[resource as keyof UsageResponse["limits"]]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-red-600">Unable to load usage. Stripe or database may be unavailable.</p>
        )}
      </section>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Cron & Jobs</h2>
        <p className="mt-2 text-sm text-gray-600">
          Ensure <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">POST /api/jobs/poll-status</code> is scheduled
          every few minutes. You can trigger a manual run below to confirm it succeeds.
        </p>
        <form className="mt-4 space-y-2" action="/api/jobs/poll-status" method="post">
          <button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900"
          >
            Trigger Poll Now
          </button>
        </form>
      </section>
    </main>
  );
}
