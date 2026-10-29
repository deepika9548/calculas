export type BookStatus = 'Available' | 'Issued' | 'Returned';

export const BOOK_CATEGORIES = [
  'Computer Science',
  'Information Technology',
  'Mathematics',
  'Engineering',
  'Physics & Chemistry',
  'Literature & Fiction',
  'History & Social Sciences',
  'Business & Economics',
  'Medicine & Health',
  'Philosophy & Arts',
  'General',
] as const;

export type BookCategory = (typeof BOOK_CATEGORIES)[number] | string;

export interface Book {
  id: string;
  user_id: string;
  title: string;
  author: string;
  isbn?: string | null;
  category: string;
  status: BookStatus;
  borrowed_date?: string | null;
  due_date?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookFormData {
  title: string;
  author: string;
  isbn?: string;
  category: string;
  status: BookStatus;
  borrowed_date?: string;
  due_date?: string;
  notes?: string;
}

export interface BookFilterParams {
  search?: string;
  status?: BookStatus | 'All';
  category?: string | 'All';
  sortBy?: 'due_date' | 'title' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

export interface DashboardStats {
  totalBooks: number;
  borrowedBooks: number;
  returnedBooks: number;
  overdueBooks: number;
  availableBooks: number;
  dueSoonBooks: number;
  upcomingDeadlines: Book[];
  categoryBreakdown: { category: string; count: number }[];
  monthlyBorrowing: { month: string; count: number }[];
}
