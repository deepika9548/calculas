'use server';

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { Book, BookFilterParams, BookFormData, DashboardStats } from '@/types/book';
import type { Database } from '@/types/database';
import { revalidatePath } from 'next/cache';

type BookUpdatePayload = Database['public']['Tables']['books']['Update'];

const SAMPLE_DEMO_BOOKS: Book[] = [
  {
    id: 'demo-1',
    user_id: 'demo-user',
    title: 'Introduction to Algorithms (4th Edition)',
    author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
    isbn: '978-0262046305',
    category: 'Computer Science',
    status: 'Issued',
    borrowed_date: new Date(Date.now() - 14 * 86400000).toISOString(),
    due_date: new Date(Date.now() - 2 * 86400000).toISOString(), // Overdue
    notes: 'Reference book for Advanced Algorithms CS301. Professor requested return before midterms.',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    user_id: 'demo-user',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    category: 'Computer Science',
    status: 'Issued',
    borrowed_date: new Date(Date.now() - 5 * 86400000).toISOString(),
    due_date: new Date(Date.now() + 2 * 86400000).toISOString(), // Due soon (2 days)
    notes: 'Library copy reserved for Software Engineering lab project.',
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    user_id: 'demo-user',
    title: 'Linear Algebra and Its Applications',
    author: 'Gilbert Strang',
    isbn: '978-0030105678',
    category: 'Mathematics',
    status: 'Available',
    borrowed_date: null,
    due_date: null,
    notes: 'Main textbook for Linear Algebra MAT204 in Science block library.',
    created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-4',
    user_id: 'demo-user',
    title: 'Database System Concepts (7th Edition)',
    author: 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan',
    isbn: '978-0078022159',
    category: 'Information Technology',
    status: 'Returned',
    borrowed_date: new Date(Date.now() - 35 * 86400000).toISOString(),
    due_date: new Date(Date.now() - 10 * 86400000).toISOString(),
    notes: 'Returned on time to Main Circulation Desk.',
    created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'demo-5',
    user_id: 'demo-user',
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell, Peter Norvig',
    isbn: '978-0134610993',
    category: 'Computer Science',
    status: 'Available',
    borrowed_date: null,
    due_date: null,
    notes: 'Hardcover edition with companion code repository.',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-6',
    user_id: 'demo-user',
    title: 'Principles of Physics: Extended International Edition',
    author: 'David Halliday, Robert Resnick, Jearl Walker',
    isbn: '978-1118230725',
    category: 'Physics & Chemistry',
    status: 'Issued',
    borrowed_date: new Date(Date.now() - 7 * 86400000).toISOString(),
    due_date: new Date(Date.now() + 7 * 86400000).toISOString(), // Due in 7 days
    notes: 'Issued to faculty research assistant for Physics 101 lab demos.',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-7',
    user_id: 'demo-user',
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    isbn: '978-0465050659',
    category: 'Philosophy & Arts',
    status: 'Returned',
    borrowed_date: new Date(Date.now() - 60 * 86400000).toISOString(),
    due_date: new Date(Date.now() - 40 * 86400000).toISOString(),
    notes: 'Design principles classic for HCI course.',
    created_at: new Date(Date.now() - 70 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 40 * 86400000).toISOString(),
  },
];

export async function getBooks(params?: BookFilterParams): Promise<{ books: Book[]; isDemo: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    // Return sample data filtered in memory for preview
    let filtered = [...SAMPLE_DEMO_BOOKS];

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        b =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          (b.isbn && b.isbn.toLowerCase().includes(q))
      );
    }

    if (params?.status && params.status !== 'All') {
      filtered = filtered.filter(b => b.status === params.status);
    }

    if (params?.category && params.category !== 'All') {
      filtered = filtered.filter(b => b.category === params.category);
    }

    if (params?.sortBy === 'due_date') {
      filtered.sort((a, b) => {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      });
    } else if (params?.sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return { books: filtered, isDemo: true };
  }

  try {
    const supabase = await createClient();
    let query = supabase.from('books').select('*');

    if (params?.search && params.search.trim() !== '') {
      const s = params.search.trim();
      query = query.or(`title.ilike.%${s}%,author.ilike.%${s}%,isbn.ilike.%${s}%`);
    }

    if (params?.status && params.status !== 'All') {
      query = query.eq('status', params.status);
    }

    if (params?.category && params.category !== 'All') {
      query = query.eq('category', params.category);
    }

    if (params?.sortBy === 'due_date') {
      query = query.order('due_date', { ascending: true, nullsFirst: false });
    } else if (params?.sortBy === 'title') {
      query = query.order('title', { ascending: true });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      return { books: [], isDemo: false, error: error.message };
    }

    return { books: (data as Book[]) || [], isDemo: false };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Database error';
    return { books: [], isDemo: false, error: msg };
  }
}

export async function getBookById(id: string): Promise<{ book: Book | null; isDemo: boolean; error?: string }> {
  if (!isSupabaseConfigured() || id.startsWith('demo-')) {
    const found = SAMPLE_DEMO_BOOKS.find(b => b.id === id) || null;
    return { book: found, isDemo: true };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return { book: null, isDemo: false, error: error.message };
    }

    return { book: data as Book, isDemo: false };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Database error';
    return { book: null, isDemo: false, error: msg };
  }
}

export async function createBook(formData: BookFormData): Promise<{ success: boolean; book?: Book; error?: string }> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase credentials are not configured yet. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local to persist books.',
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'You must be logged in to add a book.' };
    }

    const { data, error } = await supabase
      .from('books')
      .insert({
        user_id: user.id,
        title: formData.title.trim(),
        author: formData.author.trim(),
        isbn: formData.isbn?.trim() || null,
        category: formData.category || 'General',
        status: formData.status,
        borrowed_date: formData.status === 'Issued' ? (formData.borrowed_date || new Date().toISOString()) : null,
        due_date: formData.status === 'Issued' ? (formData.due_date || null) : null,
        notes: formData.notes?.trim() || null,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/books');
    revalidatePath('/dashboard');
    return { success: true, book: data as Book };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create book.';
    return { success: false, error: msg };
  }
}

export async function updateBook(
  id: string,
  formData: Partial<BookFormData>
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase is not configured yet. Please configure your .env.local file.',
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'You must be logged in to update books.' };
    }

    const updatePayload: BookUpdatePayload = {};
    if (formData.title !== undefined) updatePayload.title = formData.title.trim();
    if (formData.author !== undefined) updatePayload.author = formData.author.trim();
    if (formData.isbn !== undefined) updatePayload.isbn = formData.isbn.trim() || null;
    if (formData.category !== undefined) updatePayload.category = formData.category;
    if (formData.status !== undefined) {
      updatePayload.status = formData.status;
      if (formData.status !== 'Issued') {
        updatePayload.due_date = null;
      }
    }
    if (formData.borrowed_date !== undefined) updatePayload.borrowed_date = formData.borrowed_date || null;
    if (formData.due_date !== undefined) updatePayload.due_date = formData.due_date || null;
    if (formData.notes !== undefined) updatePayload.notes = formData.notes.trim() || null;

    const { error } = await supabase
      .from('books')
      .update(updatePayload)
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/books');
    revalidatePath(`/books/${id}`);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update book.';
    return { success: false, error: msg };
  }
}

export async function deleteBook(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase is not configured yet.',
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('books').delete().eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/books');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete book.';
    return { success: false, error: msg };
  }
}

export async function getDashboardStats(): Promise<{ stats: DashboardStats; isDemo: boolean }> {
  const { books, isDemo } = await getBooks();

  const now = new Date();
  const threeDaysFromNow = new Date(Date.now() + 3 * 86400000);

  const totalBooks = books.length;
  const borrowedBooks = books.filter(b => b.status === 'Issued').length;
  const returnedBooks = books.filter(b => b.status === 'Returned').length;
  const availableBooks = books.filter(b => b.status === 'Available').length;

  const overdueBooks = books.filter(b => {
    if (b.status !== 'Issued' || !b.due_date) return false;
    return new Date(b.due_date) < now;
  }).length;

  const dueSoonBooks = books.filter(b => {
    if (b.status !== 'Issued' || !b.due_date) return false;
    const due = new Date(b.due_date);
    return due >= now && due <= threeDaysFromNow;
  }).length;

  const upcomingDeadlines = books
    .filter(b => b.status === 'Issued' && b.due_date)
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 5);

  // Category breakdown
  const categoryMap: Record<string, number> = {};
  books.forEach(b => {
    const cat = b.category || 'General';
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });

  const categoryBreakdown = Object.entries(categoryMap)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  // Monthly activity estimation (past 6 months)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyBorrowing: { month: string; count: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const mStr = `${monthNames[d.getMonth()]}`;
    const mYear = d.getFullYear();
    const mMonth = d.getMonth();

    const count = books.filter(b => {
      const dateToCheck = b.borrowed_date || b.created_at;
      const bDate = new Date(dateToCheck);
      return bDate.getMonth() === mMonth && bDate.getFullYear() === mYear;
    }).length;

    monthlyBorrowing.push({ month: mStr, count });
  }

  return {
    stats: {
      totalBooks,
      borrowedBooks,
      returnedBooks,
      overdueBooks,
      availableBooks,
      dueSoonBooks,
      upcomingDeadlines,
      categoryBreakdown,
      monthlyBorrowing,
    },
    isDemo,
  };
}

export async function seedSampleBooksAction(): Promise<{ success: boolean; count: number; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, count: 0, error: 'Configure Supabase credentials first in .env.local' };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, count: 0, error: 'You must be logged in to seed books.' };
    }

    const toInsert = SAMPLE_DEMO_BOOKS.map(b => ({
      user_id: user.id,
      title: b.title,
      author: b.author,
      isbn: b.isbn,
      category: b.category,
      status: b.status,
      borrowed_date: b.borrowed_date,
      due_date: b.due_date,
      notes: b.notes,
    }));

    const { error } = await supabase.from('books').insert(toInsert);

    if (error) {
      return { success: false, count: 0, error: error.message };
    }

    revalidatePath('/books');
    revalidatePath('/dashboard');
    return { success: true, count: toInsert.length };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to seed sample books.';
    return { success: false, count: 0, error: msg };
  }
}
