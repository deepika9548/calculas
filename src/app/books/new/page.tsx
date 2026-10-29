import { getCurrentUser } from '@/lib/actions/auth';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { AppShell } from '@/components/AppShell';
import { BookForm } from '@/components/BookForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Add New Book | LibFlow Academic Library System',
  description: 'Catalog a new book or monograph into your library database.',
};

export default async function NewBookPage() {
  const user = await getCurrentUser();
  const configured = isSupabaseConfigured();

  return (
    <AppShell
      isConfigured={configured}
      userEmail={user?.email}
      userName={user?.user_metadata?.full_name}
      userRole={user?.user_metadata?.role || 'Campus Scholar'}
    >
      <BookForm isEdit={false} />
    </AppShell>
  );
}
