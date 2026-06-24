import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type AppRole = 'student' | 'professor' | 'military' | 'admin';

export const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<string>('approved');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setRoles([]); setLoading(false); return; }

    let cancelled = false;
    (async () => {
      const [rolesRes, profileRes] = await Promise.all([
        supabase.from('user_roles').select('role').eq('user_id', user.id),
        supabase.from('profiles').select('verification_status').eq('user_id', user.id).maybeSingle(),
      ]);
      if (cancelled) return;
      setRoles((rolesRes.data ?? []).map((r) => r.role as AppRole));
      setVerificationStatus(profileRes.data?.verification_status ?? 'approved');
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user, authLoading]);

  const has = (r: AppRole) => roles.includes(r);
  return {
    roles,
    verificationStatus,
    loading: authLoading || loading,
    isStudent: has('student'),
    isProfessor: has('professor'),
    isMilitary: has('military'),
    isAdmin: has('admin'),
    isStaff: has('professor') || has('military') || has('admin'),
  };
};
