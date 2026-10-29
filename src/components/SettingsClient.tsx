'use client';

import { useState } from 'react';
import {
  User,
  ShieldCheck,
  Database,
  Copy,
  Check,
  ExternalLink,
  LogOut,
  GraduationCap,
  Sparkles,
  Layers,
  FileCode,
} from 'lucide-react';
import { logoutAction } from '@/lib/actions/auth';

interface SettingsClientProps {
  userEmail?: string | null;
  userName?: string | null;
  userRole?: string | null;
  userId?: string | null;
  isConfigured: boolean;
}

export function SettingsClient({
  userEmail,
  userName,
  userRole = 'Campus Member',
  userId,
  isConfigured,
}: SettingsClientProps) {
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const migrationSql = `-- 1. Create Books Table
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT,
    category TEXT NOT NULL DEFAULT 'General',
    status TEXT NOT NULL CHECK (status IN ('Available', 'Issued', 'Returned')) DEFAULT 'Available',
    borrowed_date TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_books_user_id ON public.books(user_id);
CREATE INDEX IF NOT EXISTS idx_books_status ON public.books(status);
CREATE INDEX IF NOT EXISTS idx_books_category ON public.books(category);
CREATE INDEX IF NOT EXISTS idx_books_due_date ON public.books(due_date);

-- 3. Automatic Updated_At Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_books_updated_at ON public.books;
CREATE TRIGGER trigger_books_updated_at
    BEFORE UPDATE ON public.books
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 4. Row Level Security (RLS)
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own books"
    ON public.books FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own books"
    ON public.books FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own books"
    ON public.books FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own books"
    ON public.books FOR DELETE
    USING (auth.uid() = user_id);`;

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Account & System Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your user profile, Supabase PostgreSQL configuration, and security parameters.
        </p>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {userName || userEmail?.split('@')[0] || 'Academic Scholar'}
              </h3>
              <p className="text-xs text-slate-500">{userEmail || 'demo.scholar@campus.edu'}</p>
            </div>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {userRole}
          </span>
        </div>

        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">User Identifier (UUID)</span>
            <span className="font-mono text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-100 block truncate">
              {userId || 'demo-user-session-id'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Library Circulation Role</span>
            <span className="text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-100 block font-medium">
              {userRole} (Authorized to issue, renew, and catalog books)
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">End active session on this device</span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </div>

      {/* Supabase PostgreSQL Backend Status & Config Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-blue-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span>Supabase PostgreSQL Integration</span>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isConfigured
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isConfigured ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  {isConfigured ? 'Connected & Active' : 'Placeholder / Demo Mode'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Next.js App Router with official @supabase/ssr session management.
              </p>
            </div>
          </div>

          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
          >
            <span>Supabase Console</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="p-5 sm:p-6 space-y-5 text-xs">
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-2">Required Environment Variables</h4>
            <p className="text-slate-500 mb-3">
              Configure these exact environment variable names in your local <code className="text-slate-800 font-mono bg-slate-100 px-1 py-0.5 rounded">.env.local</code> file and in your Vercel deployment settings:
            </p>

            <div className="relative bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto">
              <button
                onClick={() =>
                  copyToClipboard(
                    `NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key`,
                    setCopiedEnv
                  )
                }
                className="absolute top-3 right-3 p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Copy environment variable template"
              >
                {copiedEnv ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <pre>
                NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url{'\n'}
                NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
              </pre>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-blue-600" />
                <span>Supabase SQL Migration & RLS Policies</span>
              </h4>
              <button
                onClick={() => copyToClipboard(migrationSql, setCopiedSql)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Migration'}</span>
              </button>
            </div>
            <p className="text-slate-500 mb-3">
              Paste and run this in your Supabase SQL Editor to initialize the <code className="text-slate-800 font-mono bg-slate-100 px-1 py-0.5 rounded">books</code> table with Row Level Security, automatic triggers, and indexes.
            </p>

            <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-[11px] max-h-48 overflow-y-auto">
              <pre>{migrationSql}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Circulation Rules Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 text-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Library Circulation & Security Guidelines</span>
        </h3>
        <ul className="space-y-2 text-slate-600 list-disc list-inside">
          <li><strong>Standard Loan Period:</strong> 14 calendar days from the date of issue.</li>
          <li><strong>Overdue Threshold:</strong> Books marked as Issued whose due date is prior to current time trigger alert banners.</li>
          <li><strong>Data Isolation:</strong> PostgreSQL Row Level Security guarantees that authenticated users only view and mutate their own inventory.</li>
          <li><strong>No Service Keys on Client:</strong> Only public anon key is exposed through NEXT_PUBLIC_ variables.</li>
        </ul>
      </div>
    </div>
  );
}
