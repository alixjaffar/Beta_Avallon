import Link from "next/link";

export default function Landing() {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Avallon Cloud</h1>
        <nav className="space-x-4">
          <Link href="/sign-in">Sign in</Link>
          <Link href="/dashboard" className="px-3 py-2 rounded-xl bg-black text-white">Launch App</Link>
        </nav>
      </header>
      <section className="mt-16 grid gap-8">
        <h2 className="text-5xl font-semibold leading-tight">Create a website, spin up an AI agent, buy a domain, and set up email — all in one place.</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Feature title="AI Website Builder" desc="Generate a site via Lovable or start from a template."/>
          <Feature title="AI Agent Studio" desc="Build n8n-powered agents that connect to your site."/>
          <Feature title="Domains & Email" desc="One-click domain purchase and inbox provisioning."/>
        </div>
      </section>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-gray-600">{desc}</p>
    </div>
  );
}
