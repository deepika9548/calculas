import Link from 'next/link';
import {
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Search,
  Clock,
  Sparkles,
  GraduationCap,
  Users,
  CheckCircle2,
  Database,
  Layers,
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getCurrentUser } from '@/lib/actions/auth';

export const metadata = {
  title: 'LibFlow | Academic Library & Book Management System',
  description:
    'Modern, secure, and responsive Library Management System for college students, faculty, and librarians powered by Next.js and Supabase.',
};

export default async function HomePage() {
  const configured = isSupabaseConfigured();
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              LibFlow
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/20">
                Academic
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors"
                >
                  <span>Register</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
          {/* Subtle Background Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-blue-300 border border-slate-700 mb-6 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Engineered for Colleges, Universities & Research Institutes</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
              Intelligent Library & Book Management with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                Supabase & Next.js
              </span>
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Empower students, faculty, and librarians with real-time book cataloging, circulation status tracking, due date countdowns, and automated overdue monitoring.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>Launch Library Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/books"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                <Search className="w-4 h-4 text-slate-400" />
                <span>Explore Book Catalog</span>
              </Link>
            </div>

            {/* Live Feature Highlights Pill Row */}
            <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Row Level Security (RLS)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Overdue Notification Alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Search by Title, Author, ISBN</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>@supabase/ssr Session Handling</span>
              </div>
            </div>
          </div>
        </section>

        {/* Roles & Audience Section */}
        <section className="py-16 bg-slate-950 border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Tailored for the Entire Campus Community
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                LibFlow bridges the gap between campus readers and inventory managers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Students */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">College Students</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Track course syllabus books, monitor loan return dates, avoid late penalties, and keep a personal reading ledger for exams.
                </p>
              </div>

              {/* Faculty */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Faculty & Researchers</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Reserve academic monographs, manage departmental references, and maintain research bibliography records across semesters.
                </p>
              </div>

              {/* Librarians */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Librarians & Staff</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Monitor active loans, identify overdue items instantly, update circulation statuses, and maintain catalog inventory.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Enterprise Library Architecture
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Built on modern PostgreSQL standards with Next.js App Router.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800">
              <Search className="w-6 h-6 text-blue-400 mb-3" />
              <h4 className="font-bold text-white text-base">Full-Text Search & Filters</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Filter by Subject, Circulation Status (Available, Issued, Returned), and sort by upcoming due date or alphabetical title.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800">
              <Clock className="w-6 h-6 text-amber-400 mb-3" />
              <h4 className="font-bold text-white text-base">Due Date Tracking & Overdue Alert</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Automatic calculation of remaining days with visual red notification banners whenever a book surpasses its loan deadline.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800">
              <ShieldCheck className="w-6 h-6 text-emerald-400 mb-3" />
              <h4 className="font-bold text-white text-base">PostgreSQL Row Level Security</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Database policies enforce that each authenticated user can strictly query, insert, update, and delete their own book records.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-slate-300">LibFlow</span>
            <span>— Academic Library & Book Management Suite</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:text-slate-300">
              Dashboard
            </Link>
            <Link href="/books" className="hover:text-slate-300">
              Catalog
            </Link>
            <Link href="/settings" className="hover:text-slate-300">
              Settings & SQL
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
