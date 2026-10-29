import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/auth';
import { getBookById } from '@/lib/actions/books';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { AppShell } from '@/components/AppShell';
import { BookDetailClient } from '@/components/BookDetailClient';

export const dynamic = 'force-dynamic';

interface BookPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BookPageProps) {
  const { id } = await params;
  const { book } = await getBookById(id);
  if (!book) return { title: 'Book Not Found | LibFlow' };
  return {
    title: `${book.title} | LibFlow Academic Library System`,
    description: `Catalog details for ${book.title} by ${book.author}`,
  };
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  const configured = isSupabaseConfigured();
  const { book, isDemo } = await getBookById(id);

  if (!book) {
    notFound();
  }

  return (
    <AppShell
      isConfigured={configured}
      userEmail={user?.email}
      userName={user?.user_metadata?.full_name}
      userRole={user?.user_metadata?.role || 'Campus Scholar'}
    >
      <BookDetailClient book={book} isDemo={isDemo} />
    </AppShell>
  );
}
