import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/auth';
import { getBookById } from '@/lib/actions/books';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { AppShell } from '@/components/AppShell';
import { BookForm } from '@/components/BookForm';

export const dynamic = 'force-dynamic';

interface EditBookPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditBookPageProps) {
  const { id } = await params;
  const { book } = await getBookById(id);
  if (!book) return { title: 'Book Not Found | LibFlow' };
  return {
    title: `Edit ${book.title} | LibFlow Academic Library System`,
  };
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  const configured = isSupabaseConfigured();
  const { book } = await getBookById(id);

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
      <BookForm initialData={book} isEdit={true} />
    </AppShell>
  );
}
