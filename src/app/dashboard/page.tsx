import { getCurrentUser } from '@/lib/actions/auth';
import { getDashboardStats } from '@/lib/actions/books';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { AppShell } from '@/components/AppShell';
import { DashboardClient } from '@/components/DashboardClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Dashboard | LibFlow Academic Library System',
  description: 'Overview of campus library inventory, active book loans, and circulation metrics.',
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const configured = isSupabaseConfigured();
  const { stats, isDemo } = await getDashboardStats();

  return (
    <AppShell
      isConfigured={configured}
      userEmail={user?.email}
      userName={user?.user_metadata?.full_name}
      userRole={user?.user_metadata?.role || 'Campus Scholar'}
    >
      <DashboardClient stats={stats} isDemo={isDemo} />
    </AppShell>
  );
}
