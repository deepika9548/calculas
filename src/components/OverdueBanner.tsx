'use client';

import { Book } from '@/types/book';
import Link from 'next/link';
import { AlertOctagon, ArrowRight, CalendarClock } from 'lucide-react';

interface OverdueBannerProps {
  overdueBooks: Book[];
}

export function OverdueBanner({ overdueBooks }: OverdueBannerProps) {
  if (!overdueBooks || overdueBooks.length === 0) {
    return null;
  }

  const count = overdueBooks.length;
  const firstBook = overdueBooks[0];

  return (
    <div className="bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-amber-500/10 border border-rose-200/80 rounded-xl p-4 shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center shrink-0 text-rose-600 mt-0.5 sm:mt-0">
          <AlertOctagon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-rose-950 flex items-center gap-2">
            <span>{count} Book{count > 1 ? 's' : ''} Past Due Date</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-600 text-white">
              Action Required
            </span>
          </h4>
          <p className="text-xs text-rose-800 mt-0.5">
            {firstBook.title} by {firstBook.author}
            {count > 1 ? ` and ${count - 1} other book${count > 2 ? 's are' : ' is'} past the return deadline.` : ' is past the return deadline.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
        <Link
          href="/books?status=Issued"
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors w-full sm:w-auto"
        >
          <CalendarClock className="w-3.5 h-3.5" />
          Review Overdue Items
          <ArrowRight className="w-3 h-3 ml-0.5" />
        </Link>
      </div>
    </div>
  );
}
