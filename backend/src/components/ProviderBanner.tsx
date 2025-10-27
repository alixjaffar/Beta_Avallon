// CHANGELOG: 2025-10-12 - Add reusable provider configuration banner
"use client";

export function ProviderBanner({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
      <span className="font-semibold">Provider not configured:</span> {message}
    </div>
  );
}
