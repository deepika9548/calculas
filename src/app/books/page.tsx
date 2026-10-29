import { getCurrentUser } from '@/lib/actions/auth';
import { getBooks } from '@/lib/actions/books';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { AppShell } from '@/components/AppShell';
import { BookCatalogClient } from '@/components/BookCatalogClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Book Catalog | LibFlow Academic Library System',
  description: 'Search, filter, and manage academic textbooks, reference works, and active loans.',
};

export default async function BooksPage() {
  const user = await getCurrentUser();
  const configured = isSupabaseConfigured();
  const { books, isDemo } = await getBooks();

  return (
    <AppShell
      isConfigured={configured}
      userEmail={user?.email}
      userName={user?.user_metadata?.full_name}
      userRole={user?.user_metadata?.role || 'Campus Scholar'}
    >
      <BookCatalogClient initialBooks={books} isDemo={isDemo} />
    </AppShell>
  );
}
