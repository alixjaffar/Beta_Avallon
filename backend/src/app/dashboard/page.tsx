// CHANGELOG: 2024-12-19 - Add user resource fetching to dashboard
import Link from "next/link";
import { getUser } from "@/lib/auth/getUser";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { getUserPlan } from "@/lib/billing/limits";

const PLAN_COPY: Record<string, { title: string; subtitle: string }> = {
  free: {
    title: "Free",
    subtitle: "Upgrade to unlock more sites, agents, and domains.",
  },
  pro: {
    title: "Pro",
    subtitle: "Manage your subscription or upgrade to Business.",
  },
  business: {
    title: "Business",
    subtitle: "Manage billing for your organization.",
  },
};

export default async function Dashboard() {
  try {
    const user = await getUser();

    // Fetch user's resources
    const [sites, agents, domains, plan] = await Promise.all([
      prisma.site.findMany({
        where: { ownerId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.agent.findMany({
        where: { ownerId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.domain.findMany({
        where: { ownerId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      getUserPlan(user.id),
    ]);

    return (
      <main className="mx-auto max-w-6xl p-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back! Manage your websites, agents, and domains.</p>
        
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card title="Websites" href="/studio/sites" count={sites.length} items={sites} />
          <Card title="AI Agents" href="/studio/agents" count={agents.length} items={agents} />
          <Card title="Domains & Email" href="/studio/domains" count={domains.length} items={domains} />
          <BillingOverview plan={plan} />
        </div>
      </main>
    );
  } catch (error) {
    // Redirect to sign-in if not authenticated
    redirect('/sign-in');
  }
}

function BillingOverview({ plan }: { plan: string }) {
  const copy = PLAN_COPY[plan] ?? PLAN_COPY.free;
  return (
    <Link href="/studio/billing" className="block rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Billing</h3>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase text-gray-700">{plan}</span>
      </div>
      <p className="text-gray-600 mb-4">{copy.subtitle}</p>
      <span className="text-sm font-semibold text-blue-600">Manage plan →</span>
    </Link>
  );
}

function Card({ 
  title, 
  href, 
  count, 
  items 
}: { 
  title: string; 
  href: string; 
  count: number;
  items: any[];
}) {
  return (
    <Link href={href} className="block rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <span className="text-sm text-gray-500">{count} {count === 1 ? 'item' : 'items'}</span>
      </div>
      <p className="text-gray-600 mb-4">Manage and create {title.toLowerCase()}.</p>
      
      {items.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Recent:</h4>
          {items.slice(0, 3).map((item) => (
            <div key={item.id} className="text-sm text-gray-600">
              <div className="font-medium">{item.name || item.domain}</div>
              <div className="text-xs text-gray-500">
                Status: <span className={`px-1 py-0.5 rounded text-xs ${
                  item.status === 'active' || item.status === 'live' ? 'bg-green-100 text-green-800' :
                  item.status === 'building' || item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Link>
  );
}
