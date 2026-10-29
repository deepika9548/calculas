'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Book } from '@/types/book';
import { StatusBadge } from './StatusBadge';
import { DeleteBookModal } from './DeleteBookModal';
import { updateBook } from '@/lib/actions/books';
import {
  BookOpen,
  User,
  Hash,
  Bookmark,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  ArrowLeft,
  FileText,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface BookDetailClientProps {
  book: Book;
  isDemo: boolean;
}

export function BookDetailClient({ book, isDemo }: BookDetailClientProps) {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const isIssued = book.status === 'Issued';
  const isOverdue =
    isIssued && book.due_date && new Date(book.due_date).getTime() < Date.now();

  const handleToggleStatus = async () => {
    setUpdating(true);
    const newStatus = isIssued ? 'Returned' : 'Issued';
    const newDueDate = !isIssued
      ? new Date(Date.now() + 14 * 86400000).toISOString()
      : undefined;

    await updateBook(book.id, {
      status: newStatus,
      borrowed_date: !isIssued ? new Date().toISOString() : book.borrowed_date || undefined,
      due_date: newDueDate,
    });

    setUpdating(false);
    router.refresh();
  };

  const calculateDaysRemaining = (dueDateStr?: string | null) => {
    if (!dueDateStr) return null;
    const due = new Date(dueDateStr);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''}`, alert: true };
    }
    if (diffDays === 0) {
      return { label: 'Due today', alert: true };
    }
    return { label: `${diffDays} day${diffDays > 1 ? 's' : ''} remaining`, alert: diffDays <= 3 };
  };

  const daysInfo = calculateDaysRemaining(book.due_date);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button and quick actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Book Catalog</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleToggleStatus}
            disabled={updating}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors border shadow-2xs ${
              isIssued
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
            }`}
          >
            {isIssued ? <RotateCcw className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
            <span>{isIssued ? 'Mark Book as Returned' : 'Issue Book to Borrower'}</span>
          </button>

          <Link
            href={`/books/${book.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit</span>
          </Link>

          <button
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 shadow-2xs transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Overdue Alert if applicable */}
      {isOverdue && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-900">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold text-rose-950 text-sm">Return Deadline Exceeded</h4>
            <p className="mt-0.5 text-rose-800">
              This volume was due on {new Date(book.due_date!).toLocaleDateString(undefined, { dateStyle: 'full' })} and has exceeded standard loan guidelines.
            </p>
          </div>
        </div>
      )}

      {/* Main Book Record Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Banner */}
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
              <Bookmark className="w-3.5 h-3.5" />
              {book.category}
            </span>

            <StatusBadge status={book.status} dueDate={book.due_date} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {book.title}
          </h1>

          <p className="text-sm font-medium text-slate-600 mt-2 flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <span>Authored by {book.author}</span>
          </p>
        </div>

        {/* Details Grid */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            {/* ISBN */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                ISBN Standard Identifier
              </span>
              <span className="font-mono font-bold text-slate-800 text-sm">
                {book.isbn || 'Not Specified'}
              </span>
            </div>

            {/* Borrowed Date */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Issued / Borrowed Date
              </span>
              <span className="font-medium text-slate-800 text-sm">
                {book.borrowed_date
                  ? new Date(book.borrowed_date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'N/A (In Shelf)'}
              </span>
            </div>

            {/* Due Date & Countdown */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Scheduled Return Deadline
              </span>
              <div className="flex items-center justify-between">
                <span
                  className={`font-bold text-sm ${
                    isOverdue ? 'text-rose-600' : 'text-slate-800'
                  }`}
                >
                  {book.due_date
                    ? new Date(book.due_date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </span>
                {daysInfo && (
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      daysInfo.alert
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {daysInfo.label}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Notes & Shelf Location */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Notes & Shelf Location
            </h4>
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {book.notes || 'No specific shelf or reservation notes logged for this entry.'}
            </div>
          </div>

          {/* System Audit Information */}
          <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-400">
            <div>
              <span>Catalog Record ID: </span>
              <span className="font-mono text-slate-600 font-medium">{book.id}</span>
            </div>
            <div className="sm:text-right">
              <span>Cataloged on: </span>
              <span className="text-slate-600 font-medium">
                {new Date(book.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <DeleteBookModal
        bookId={book.id}
        bookTitle={book.title}
        bookAuthor={book.author}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onSuccess={() => {
          router.push('/books');
          router.refresh();
        }}
      />
    </div>
  );
}
