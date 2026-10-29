'use server';

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { redirect } from 'next/navigation';

export interface AuthResponse {
  success: boolean;
  error?: string;
  message?: string;
}

export async function loginAction(formData: FormData): Promise<AuthResponse> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase credentials are not configured yet. Please update .env.local with your Supabase URL & Anon Key.',
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'An unexpected error occurred during login.';
    return { success: false, error: msg };
  }
}

export async function signupAction(formData: FormData): Promise<AuthResponse> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = (formData.get('fullName') as string) || '';
  const role = (formData.get('role') as string) || 'Student';

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase credentials are not configured yet. Please update .env.local with your Supabase URL & Anon Key.',
    };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Check if email confirmation is required
    if (data?.user && !data.session) {
      return {
        success: true,
        message: 'Account registered! Please check your email to confirm your account or sign in if confirmation is disabled in your Supabase project.',
      };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'An unexpected error occurred during signup.';
    return { success: false, error: msg };
  }
}

export async function logoutAction() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }
  redirect('/login');
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}
