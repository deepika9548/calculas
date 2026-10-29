'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Book, BOOK_CATEGORIES, BookStatus } from '@/types/book';
import { BookCard } from './BookCard';
import { BookTable } from './BookTable';
import {
  Search,
  Filter,
  ArrowUpDown,
  PlusCircle,
  LayoutGrid,
  List,
  RotateCcw,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { seedSampleBooksAction } from '@/lib/actions/books';

interface BookCatalogClientProps {
  initialBooks: Book[];
  isDemo: boolean;
}

export function BookCatalogClient({ initialBooks, isDemo }: BookCatalogClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'due_date' | 'title' | 'created_at'>('created_at');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [seeding, setSeeding] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Client-side filtering & sorting for instant responsiveness
  const filteredBooks = useMemo(() => {
    return initialBooks
      .filter((book) => {
        // Search filter
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchesTitle = book.title.toLowerCase().includes(q);
          const matchesAuthor = book.author.toLowerCase().includes(q);
          const matchesIsbn = book.isbn ? book.isbn.toLowerCase().includes(q) : false;
          if (!matchesTitle && !matchesAuthor && !matchesIsbn) return false;
        }

        // Status filter
        if (statusFilter !== 'All' && book.status !== statusFilter) {
          return false;
        }

        // Category filter
        if (categoryFilter !== 'All' && book.category !== categoryFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'due_date') {
          if (!a.due_date && !b.due_date) return 0;
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        // created_at descending
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [initialBooks, search, statusFilter, categoryFilter, sortBy]);

  const hasActiveFilters = search !== '' || statusFilter !== 'All' || categoryFilter !== 'All' || sortBy !== 'created_at';

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setCategoryFilter('All');
    setSortBy('created_at');
  };

  const handleSeedBooks = async () => {
    setSeeding(true);
    setFeedbackMsg(null);
    const res = await seedSampleBooksAction();
    if (res.success) {
      setFeedbackMsg(`Successfully added ${res.count} curated academic books!`);
      router.refresh();
    } else {
      setFeedbackMsg(res.error || 'Failed to seed sample books.');
    }
    setSeeding(false);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Book Catalog
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse, search, and manage all academic textbooks and reference materials.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSeedBooks}
            disabled={seeding}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs transition-colors disabled:opacity-50"
            title="Populate catalog with realistic sample college books"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{seeding ? 'Populating...' : 'Seed Sample Books'}</span>
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

      {feedbackMsg && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-medium text-blue-800 animate-in fade-in">
          {feedbackMsg}
        </div>
      )}

      {/* Search, Filter, Sort Controls Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Title, Author, or ISBN..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Issued">Issued / Borrowed</option>
              <option value="Returned">Returned</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors text-slate-700"
            >
              <option value="All">All Categories</option>
              {BOOK_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'due_date' | 'title' | 'created_at')}
              className="w-full py-2 px-3 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors text-slate-700"
            >
              <option value="created_at">Newest First</option>
              <option value="due_date">Due Date (Closest)</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Bottom meta row: Results count, Clear filter button, and view switcher */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              Showing <strong className="text-slate-800">{filteredBooks.length}</strong> of{' '}
              <strong className="text-slate-800">{initialBooks.length}</strong> books
            </span>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 underline"
              >
                <RotateCcw className="w-3 h-3" />
                Clear all filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Book List / Grid / Empty State */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No books found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {hasActiveFilters
              ? 'No books matched your filter or search criteria. Try adjusting or clearing your filters.'
              : 'Your library catalog is currently empty. Start by adding your first book or generating sample academic data.'}
          </p>

          <div className="mt-5 flex items-center justify-center gap-3">
            {hasActiveFilters ? (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Reset Filters
              </button>
            ) : (
              <Link
                href="/books/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Add First Book
              </Link>
            )}
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onRefresh={() => router.refresh()}
            />
          ))}
        </div>
      ) : (
        <BookTable
          books={filteredBooks}
          onRefresh={() => router.refresh()}
        />
      )}
    </div>
  );
}
