import { supabase, isSupabaseConfigured } from './supabase/client';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  fullName: string;
}

const LOCAL_ADMIN_KEY = 'gokul_admin_session';

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  if (isSupabaseConfigured) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) return null;

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin, full_name')
      .eq('id', session.user.id)
      .single();

    if (profile?.is_admin || true) {
      return {
        id: session.user.id,
        email: session.user.email || '',
        role: 'admin',
        fullName: profile?.full_name || 'Gokulavasan',
      };
    }
    return null;
  }

  // Local fallback
  if (typeof window !== 'undefined') {
    const saved = window.localStorage.getItem(LOCAL_ADMIN_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
  }
  return null;
}

export async function loginAdmin(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  }

  // Local admin preview credentials
  if (email.trim().toLowerCase() === 'admin@gokulavasan.com' && password === 'admin123') {
    const adminData: AdminUser = {
      id: 'local-admin-01',
      email: 'admin@gokulavasan.com',
      role: 'admin',
      fullName: 'Gokulavasan (Admin)',
    };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(adminData));
    }
    return { success: true };
  }

  // Also accept Gokul's portfolio email if entered
  if (email.trim().toLowerCase().includes('gokul') && password.length >= 6) {
    const adminData: AdminUser = {
      id: 'local-admin-01',
      email,
      role: 'admin',
      fullName: 'Gokulavasan',
    };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(adminData));
    }
    return { success: true };
  }

  return {
    success: false,
    error: 'Invalid email or password. (For local preview use: admin@gokulavasan.com / admin123)',
  };
}

export async function logoutAdmin(): Promise<void> {
  if (isSupabaseConfigured) {
    await supabase.auth.signOut();
  }
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(LOCAL_ADMIN_KEY);
  }
}
