import { supabase } from '@/integrations/supabase/client';

export type RoleRequested = 'student' | 'professor' | 'military';

// Convert cedula to a deterministic synthetic email so users can authenticate with their ID card.
export const cedulaToEmail = (cedula: string): string => {
  const clean = cedula.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  return `${clean.toLowerCase()}@cedula.unefa.local`;
};

export interface RegisterPayload {
  cedula: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  semester?: string;
  career?: string;
  roleRequested: RoleRequested;
  credentials?: string;
  rank?: string;
  institution?: string;
}

export const signUpWithCedula = async (p: RegisterPayload) => {
  return supabase.auth.signUp({
    email: cedulaToEmail(p.cedula),
    password: p.password,
    options: {
      emailRedirectTo: `${window.location.origin}/dashboard`,
      data: {
        cedula: p.cedula.trim().toUpperCase(),
        first_name: p.firstName,
        last_name: p.lastName,
        email_real: p.email,
        semester: p.semester ?? '',
        career: p.career ?? '',
        role_requested: p.roleRequested,
        credentials: p.credentials ?? '',
        rank: p.rank ?? '',
        institution: p.institution ?? '',
      },
    },
  });
};

export const signInWithCedula = async (cedula: string, password: string) =>
  supabase.auth.signInWithPassword({ email: cedulaToEmail(cedula), password });

export const signOut = () => supabase.auth.signOut();
