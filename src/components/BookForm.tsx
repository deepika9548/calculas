'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Book, BOOK_CATEGORIES, BookFormData, BookStatus } from '@/types/book';
import { createBook, updateBook } from '@/lib/actions/books';
import {
  BookOpen,
  User,
  Hash,
  Bookmark,
  Calendar,
  FileText,
  Save,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface BookFormProps {
  initialData?: Book;
  isEdit?: boolean;
}

export function BookForm({ initialData, isEdit = false }: BookFormProps) {
  const router = useRouter();

  // Helper to format ISO date to yyyy-mm-dd for input[type="date"]
  const toDateInputVal = (isoStr?: string | null) => {
    if (!isoStr) return '';
    try {
      return new Date(isoStr).toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const defaultDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 14); // 2 weeks standard borrowing period
    return d.toISOString().split('T')[0];
  };

  const [title, setTitle] = useState(initialData?.title || '');
  const [author, setAuthor] = useState(initialData?.author || '');
  const [isbn, setIsbn] = useState(initialData?.isbn || '');
  const [category, setCategory] = useState(initialData?.category || 'Computer Science');
  const [status, setStatus] = useState<BookStatus>(initialData?.status || 'Available');
  const [borrowedDate, setBorrowedDate] = useState(
    toDateInputVal(initialData?.borrowed_date) || new Date().toISOString().split('T')[0]
  );
  const [dueDate, setDueDate] = useState(
    toDateInputVal(initialData?.due_date) || defaultDueDate()
  );
  const [notes, setNotes] = useState(initialData?.notes || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!title.trim()) {
      setError('Book title is required.');
      return;
    }
    if (!author.trim()) {
      setError('Author name is required.');
      return;
    }

    setLoading(true);

    const payload: BookFormData = {
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim() || undefined,
      category,
      status,
      borrowed_date: status === 'Issued' && borrowedDate ? new Date(borrowedDate).toISOString() : undefined,
      due_date: status === 'Issued' && dueDate ? new Date(dueDate).toISOString() : undefined,
      notes: notes.trim() || undefined,
    };

    if (isEdit && initialData) {
      const res = await updateBook(initialData.id, payload);
      if (!res.success) {
        setError(res.error || 'Failed to update book.');
        setLoading(false);
        return;
      }
      setSuccess('Book details updated successfully!');
      setTimeout(() => {
        router.push(`/books/${initialData.id}`);
        router.refresh();
      }, 800);
    } else {
      const res = await createBook(payload);
      if (!res.success) {
        setError(res.error || 'Failed to add book.');
        setLoading(false);
        return;
      }
      setSuccess('Book added to library catalog successfully!');
      setTimeout(() => {
        router.push('/books');
        router.refresh();
      }, 800);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header & Back link */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href={isEdit && initialData ? `/books/${initialData.id}` : '/books'}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isEdit ? 'Back to Book Details' : 'Back to Catalog'}</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Form Title Banner */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {isEdit ? 'Edit Book Details' : 'Add New Book Entry'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isEdit
                  ? 'Update academic metadata and catalog circulation status.'
                  : 'Register a textbook or academic monograph to your library repository.'}
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Alerts */}
        <div className="p-6 pb-0 space-y-3">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}
        </div>

        {/* The Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Book Title <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Introduction to Algorithms (4th Edition)"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Author */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Author(s) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Thomas H. Cormen, Charles E. Leiserson"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Category & ISBN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Category / Subject <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Bookmark className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors text-slate-800"
                >
                  {BOOK_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                ISBN Number <span className="text-slate-400 text-[10px] normal-case">(Optional)</span>
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  placeholder="e.g. 978-0262046305"
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors font-mono"
                />
              </div>
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
              Circulation Status <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['Available', 'Issued', 'Returned'] as BookStatus[]).map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    status === s
                      ? s === 'Available'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-100'
                        : s === 'Issued'
                        ? 'border-blue-500 bg-blue-50 text-blue-800 ring-2 ring-blue-100'
                        : 'border-slate-500 bg-slate-100 text-slate-800 ring-2 ring-slate-200'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {s === 'Issued' ? 'Issued / Borrowed' : s}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Dates when Issued */}
          {status === 'Issued' && (
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-3.5">
              <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Borrowing & Return Schedule
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Date Borrowed
                  </label>
                  <input
                    type="date"
                    value={borrowedDate}
                    onChange={(e) => setBorrowedDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Due Date (Return Deadline)
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-slate-800 font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notes / Remarks */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Notes & Shelf Location <span className="text-slate-400 text-[10px] normal-case">(Optional)</span>
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Shelf CS-A3, reserved for Fall semester algorithms lab."
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              href={isEdit && initialData ? `/books/${initialData.id}` : '/books'}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEdit ? 'Update Book Record' : 'Save Book to Catalog'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
