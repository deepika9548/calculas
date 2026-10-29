'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Book } from '@/types/book';
import { StatusBadge } from './StatusBadge';
import { DeleteBookModal } from './DeleteBookModal';
import { updateBook } from '@/lib/actions/books';
import {
  ExternalLink,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  RotateCcw,
} from 'lucide-react';

interface BookTableProps {
  books: Book[];
  onRefresh?: () => void;
}

export function BookTable({ books, onRefresh }: BookTableProps) {
  const [activeDeleteBook, setActiveDeleteBook] = useState<Book | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleToggleStatus = async (book: Book) => {
    setUpdatingId(book.id);
    const isIssued = book.status === 'Issued';
    const newStatus = isIssued ? 'Returned' : 'Issued';
    const newDueDate = !isIssued
      ? new Date(Date.now() + 14 * 86400000).toISOString()
      : undefined;

    await updateBook(book.id, {
      status: newStatus,
      borrowed_date: !isIssued ? new Date().toISOString() : book.borrowed_date || undefined,
      due_date: newDueDate,
    });

    setUpdatingId(null);
    if (onRefresh) onRefresh();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">Book Title & Author</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Due Date</th>
              <th className="py-3.5 px-4">ISBN</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {books.map((book) => {
              const isOverdue =
                book.status === 'Issued' &&
                book.due_date &&
                new Date(book.due_date).getTime() < Date.now();

              return (
                <tr
                  key={book.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isOverdue ? 'bg-rose-50/30' : ''
                  }`}
                >
                  {/* Title & Author */}
                  <td className="py-4 px-4 sm:px-6">
                    <Link
                      href={`/books/${book.id}`}
                      className="font-bold text-slate-900 hover:text-blue-600 transition-colors block line-clamp-1"
                    >
                      {book.title}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {book.author}
                    </p>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {book.category}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <StatusBadge status={book.status} dueDate={book.due_date} />
                  </td>

                  {/* Due Date */}
                  <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-600">
                    {book.status === 'Issued' && book.due_date ? (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className={isOverdue ? 'font-bold text-rose-600' : ''}>
                          {new Date(book.due_date).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  {/* ISBN */}
                  <td className="py-4 px-4 whitespace-nowrap font-mono text-xs text-slate-500">
                    {book.isbn || '—'}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleToggleStatus(book)}
                        disabled={updatingId === book.id}
                        className="px-2 py-1 text-xs font-medium rounded-lg text-slate-600 hover:text-blue-700 hover:bg-slate-100 transition-colors"
                        title={book.status === 'Issued' ? 'Mark Returned' : 'Issue Book'}
                      >
                        {book.status === 'Issued' ? (
                          <span className="flex items-center gap-1">
                            <RotateCcw className="w-3 h-3" />
                            Return
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Issue
                          </span>
                        )}
                      </button>

                      <Link
                        href={`/books/${book.id}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                        title="View Details"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      <Link
                        href={`/books/${book.id}/edit`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        title="Edit Record"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => setActiveDeleteBook(book)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {activeDeleteBook && (
        <DeleteBookModal
          bookId={activeDeleteBook.id}
          bookTitle={activeDeleteBook.title}
          bookAuthor={activeDeleteBook.author}
          isOpen={true}
          onClose={() => setActiveDeleteBook(null)}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
}
