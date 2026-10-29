'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Book } from '@/types/book';
import { StatusBadge } from './StatusBadge';
import { DeleteBookModal } from './DeleteBookModal';
import { updateBook } from '@/lib/actions/books';
import {
  BookOpen,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCheck,
  Bookmark,
  Hash,
} from 'lucide-react';

interface BookCardProps {
  book: Book;
  onRefresh?: () => void;
}

export function BookCard({ book, onRefresh }: BookCardProps) {
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
    if (onRefresh) onRefresh();
  };

  const formatDeadline = (dateStr?: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)}d overdue`, urgent: true };
    }
    if (diffDays === 0) {
      return { text: 'Due today', urgent: true };
    }
    if (diffDays <= 3) {
      return { text: `Due in ${diffDays}d`, urgent: true };
    }
    return { text: `Due in ${diffDays}d`, urgent: false };
  };

  const deadline = formatDeadline(book.due_date);

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 hover:shadow-md flex flex-col justify-between overflow-hidden ${
        isOverdue
          ? 'border-rose-300 ring-1 ring-rose-300/40'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="p-5 flex-1">
        {/* Top meta tags */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
            <Bookmark className="w-3 h-3 text-slate-400" />
            {book.category}
          </span>
          <StatusBadge status={book.status} dueDate={book.due_date} />
        </div>

        {/* Title and Author */}
        <Link href={`/books/${book.id}`} className="group block">
          <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-base leading-snug">
            {book.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-1 font-medium">
            by {book.author}
          </p>
        </Link>

        {/* ISBN & Meta */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
          {book.isbn && (
            <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
              <Hash className="w-3 h-3 text-slate-400 shrink-0" />
              <span>ISBN: {book.isbn}</span>
            </div>
          )}

          {isIssued && book.due_date && (
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Due: {new Date(book.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              {deadline && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    deadline.urgent
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {deadline.text}
                </span>
              )}
            </div>
          )}

          {book.status === 'Returned' && (
            <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] pt-1">
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Returned to circulation</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Actions Bottom Bar */}
      <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={handleToggleStatus}
          disabled={updating}
          className="text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors flex items-center gap-1"
          title={isIssued ? 'Mark book as returned' : 'Issue book to borrower'}
        >
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{isIssued ? 'Mark Returned' : 'Issue Book'}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <Link
            href={`/books/${book.id}`}
            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-white transition-colors"
            title="View Details"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <Link
            href={`/books/${book.id}/edit`}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white transition-colors"
            title="Edit Details"
          >
            <Edit2 className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete Book"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <DeleteBookModal
        bookId={book.id}
        bookTitle={book.title}
        bookAuthor={book.author}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onSuccess={onRefresh}
      />
    </div>
  );
}
