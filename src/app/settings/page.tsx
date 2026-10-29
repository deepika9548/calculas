import { getCurrentUser } from '@/lib/actions/auth';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { AppShell } from '@/components/AppShell';
import { SettingsClient } from '@/components/SettingsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Settings | LibFlow Academic Library System',
  description: 'Manage account, database connection, and security configurations.',
};

export default async function SettingsPage() {
  const user = await getCurrentUser();
  const configured = isSupabaseConfigured();

  return (
    <AppShell
      isConfigured={configured}
      userEmail={user?.email}
      userName={user?.user_metadata?.full_name}
      userRole={user?.user_metadata?.role || 'Campus Scholar'}
    >
      <SettingsClient
        userEmail={user?.email}
        userName={user?.user_metadata?.full_name}
        userRole={user?.user_metadata?.role || 'Campus Scholar'}
        userId={user?.id}
        isConfigured={configured}
      />
    </AppShell>
  );
}
