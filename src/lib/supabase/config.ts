export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Support both old "anon key" name and new Supabase "publishable key" name
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) return false;

  // Reject placeholder template values
  if (
    url === 'your_supabase_project_url' ||
    key === 'your_supabase_publishable_or_anon_key'
  ) {
    return false;
  }

  // Reject invalid URL format
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return false;
  }

  return true;
}

/** Returns the resolved anon / publishable key regardless of variable name */
export function getSupabaseAnonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ''
  );
}
