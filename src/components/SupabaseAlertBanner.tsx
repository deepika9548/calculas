'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Copy, Check, ExternalLink, X } from 'lucide-react';

interface SupabaseAlertBannerProps {
  isConfigured: boolean;
}

export function SupabaseAlertBanner({ isConfigured }: SupabaseAlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (isConfigured || dismissed) {
    return null;
  }

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-amber-900 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-sm">
        <div className="flex items-start md:items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 md:mt-0" />
          <div>
            <span className="font-semibold text-amber-950">Supabase Connection Notice:</span>{' '}
            Currently running in <strong>Interactive Demo & Preview Mode</strong>. To connect your live Supabase cloud database, update your credentials in{' '}
            <code className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono text-xs">.env.local</code>.
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <button
            onClick={handleCopyEnv}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-amber-100 hover:bg-amber-200 text-amber-900 rounded border border-amber-300 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied Env Format' : 'Copy Env Template'}
          </button>
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-950 hover:underline"
          >
            Supabase Dashboard
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-amber-700 hover:text-amber-950 rounded hover:bg-amber-100"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
