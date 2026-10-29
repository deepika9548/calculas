'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardStats, Book } from '@/types/book';
import { StatusBadge } from './StatusBadge';
import { OverdueBanner } from './OverdueBanner';
import {
  BookOpen,
  Clock,
  CheckCheck,
  AlertOctagon,
  ArrowRight,
  PlusCircle,
  Calendar,
  Sparkles,
  TrendingUp,
  Bookmark,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { updateBook, seedSampleBooksAction } from '@/lib/actions/books';

interface DashboardClientProps {
  stats: DashboardStats;
  isDemo: boolean;
}

export function DashboardClient({ stats, isDemo }: DashboardClientProps) {
  const router = useRouter();
  const [seeding, setSeeding] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleMarkReturned = async (bookId: string) => {
    setUpdatingId(bookId);
    await updateBook(bookId, { status: 'Returned' });
    setUpdatingId(null);
    router.refresh();
  };

  const handleSeed = async () => {
    setSeeding(true);
    await seedSampleBooksAction();
    setSeeding(false);
    router.refresh();
  };

  // Find all overdue books from upcoming deadlines or compute
  const overdueItems = stats.upcomingDeadlines.filter(
    (b) => b.due_date && new Date(b.due_date).getTime() < Date.now()
  );

  return (
    <div className="space-y-8">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Library Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time catalog analytics, circulation metrics, and return deadlines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs transition-colors disabled:opacity-50"
            title="Populate catalog with sample college books"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{seeding ? 'Generating...' : 'Seed Sample Books'}</span>
          </button>

          <Link
            href="/books/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Book</span>
          </Link>
        </div>
      </div>

      {/* Overdue Notification Banner if any books are overdue */}
      {overdueItems.length > 0 && <OverdueBanner overdueBooks={overdueItems} />}

      {/* 4 Primary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Books */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Catalog
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900">
              {stats.totalBooks}
            </span>
            <span className="text-xs text-slate-500 ml-2">records</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">{stats.availableBooks} Available</span>
            <span>in shelves</span>
          </div>
        </div>

        {/* Currently Issued */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Issued / Borrowed
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900">
              {stats.borrowedBooks}
            </span>
            <span className="text-xs text-slate-500 ml-2">active loans</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span className="text-blue-600 font-semibold">{stats.dueSoonBooks} due soon</span>
            <span>within 72 hrs</span>
          </div>
        </div>

        {/* Returned Books */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Returned & Restocked
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900">
              {stats.returnedBooks}
            </span>
            <span className="text-xs text-slate-500 ml-2">completed</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">100% Verified</span>
            <span>circulation cycle</span>
          </div>
        </div>

        {/* Overdue Count */}
        <div
          className={`bg-white rounded-2xl border p-5 shadow-xs transition-colors ${
            stats.overdueBooks > 0
              ? 'border-rose-300 bg-rose-50/20 ring-1 ring-rose-200'
              : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Overdue Returns
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                stats.overdueBooks > 0
                  ? 'bg-rose-100 text-rose-600 animate-pulse'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span
              className={`text-3xl font-black ${
                stats.overdueBooks > 0 ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {stats.overdueBooks}
            </span>
            <span className="text-xs text-slate-500 ml-2">overdue</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {stats.overdueBooks > 0 ? (
              <span className="text-rose-600 font-semibold">Late returns pending</span>
            ) : (
              <span className="text-emerald-600 font-medium">All deadlines clear</span>
            )}
          </div>
        </div>
      </div>

      {/* Mid Section: Upcoming Deadlines & Monthly Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upcoming Return Deadlines (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Upcoming Return Deadlines
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Nearest scheduled return dates for currently issued books.
                </p>
              </div>

              <Link
                href="/books?status=Issued"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {stats.upcomingDeadlines.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <CheckCheck className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                <p className="text-xs font-semibold text-slate-700">No active book loans pending return</p>
                <p className="text-[11px] text-slate-400 mt-0.5">All books are in shelf stock or returned.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.upcomingDeadlines.map((book) => {
                  const isLate =
                    book.due_date && new Date(book.due_date).getTime() < Date.now();

                  return (
                    <div
                      key={book.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                        isLate
                          ? 'bg-rose-50/50 border-rose-200'
                          : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-50'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/books/${book.id}`}
                          className="font-bold text-xs text-slate-900 hover:text-blue-600 truncate block"
                        >
                          {book.title}
                        </Link>
                        <p className="text-[11px] text-slate-500 truncate">
                          by {book.author}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span
                            className={`text-xs font-semibold block ${
                              isLate ? 'text-rose-600' : 'text-slate-700'
                            }`}
                          >
                            {book.due_date
                              ? new Date(book.due_date).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : 'No date'}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                            {isLate ? 'Overdue' : 'Due Date'}
                          </span>
                        </div>

                        <button
                          onClick={() => handleMarkReturned(book.id)}
                          disabled={updatingId === book.id}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 rounded-lg shadow-2xs transition-colors"
                          title="Mark returned"
                        >
                          Return
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Standard loan period: 14 academic days</span>
            <Link href="/books/new" className="font-semibold text-blue-600 hover:underline">
              + Issue another book
            </Link>
          </div>
        </div>

        {/* Monthly Activity & Progress (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Monthly Borrowing Trends
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Academic circulation activity over the past 6 months.
                </p>
              </div>
            </div>

            {/* Custom SVG / Bar graph */}
            <div className="space-y-3.5 pt-2">
              {stats.monthlyBorrowing.map((m) => {
                const max = Math.max(...stats.monthlyBorrowing.map((x) => x.count), 1);
                const percent = Math.round((m.count / max) * 100);

                return (
                  <div key={m.month} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{m.month}</span>
                      <span className="font-bold text-slate-900">{m.count} books</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-500"
                        style={{ width: `${Math.max(percent, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Dynamic progress from database</span>
            <span className="font-semibold text-emerald-600">Active Cycle</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Category Distribution & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-blue-600" />
                Collection by Subject / Department
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Distribution of catalog items across academic disciplines.
              </p>
            </div>
          </div>

          {stats.categoryBreakdown.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No categories recorded yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stats.categoryBreakdown.map((item) => (
                <Link
                  key={item.category}
                  href={`/books?category=${encodeURIComponent(item.category)}`}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 transition-colors flex items-center justify-between group"
                >
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 truncate">
                    {item.category}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 group-hover:border-blue-300 group-hover:text-blue-700 shrink-0">
                    {item.count}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Help & Architecture Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Supabase Architecture
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              LibFlow Cloud Database
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Equipped with PostgreSQL, Row Level Security (RLS) policies, and @supabase/ssr session management. Each user’s books remain strictly isolated and protected.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700/60 space-y-2">
            <Link
              href="/settings"
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
            >
              <span>View Database Schema & Settings</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="/books"
              className="flex items-center justify-between p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors"
            >
              <span>Explore Complete Book Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
