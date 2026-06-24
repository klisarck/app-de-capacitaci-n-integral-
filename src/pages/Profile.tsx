import { useEffect, useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import AppLayout from '@/components/AppLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileData {
  first_name: string | null;
  last_name: string | null;
  cedula: string;
  email: string | null;
  semester: string | null;
  career: string | null;
  rank: string | null;
  institution: string | null;
  role_requested: string;
  verification_status: string;
}

const Profile = () => {
  const { t, lang } = useI18n();
  const { user, loading } = useAuth();
  const { roles, isStaff } = useUserRole();
  const navigate = useNavigate();
  const [p, setP] = useState<ProfileData | null>(null);
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const isEs = lang === 'es';

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate('/login'); return; }
    supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => setP(data as ProfileData));
  }, [user, loading, navigate]);

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.next !== pw.confirm) { toast.error(isEs ? 'No coinciden' : "Don't match"); return; }
    if (pw.next.length < 6) { toast.error(isEs ? 'Mínimo 6 caracteres' : 'Min 6 chars'); return; }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pw.next });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(isEs ? 'Contraseña actualizada' : 'Password updated');
    setPw({ current: '', next: '', confirm: '' });
  };

  if (loading || !p) {
    return <AppLayout isLoggedIn><div className="container py-16 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div></AppLayout>;
  }

  const roleLabel = (r: string) => ({
    student: isEs ? 'Estudiante' : 'Student',
    professor: isEs ? 'Profesor' : 'Professor',
    military: isEs ? 'Militar' : 'Military',
    admin: isEs ? 'Administrador' : 'Admin',
  } as Record<string, string>)[r] ?? r;

  return (
    <AppLayout isLoggedIn userName={p.first_name || undefined}>
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl font-black mb-2">{t.profile.title}</h1>
          <div className="flex flex-wrap gap-2 mb-8">
            {roles.length === 0 && (
              <Badge className="rounded-none bg-yellow-600 uppercase text-[10px]">
                <ShieldAlert className="h-3 w-3 mr-1" />
                {isEs ? 'Sin rol asignado' : 'No role assigned'}
              </Badge>
            )}
            {roles.map((r) => (
              <Badge key={r} className="rounded-none bg-military-green uppercase text-[10px]">
                <ShieldCheck className="h-3 w-3 mr-1" />{roleLabel(r)}
              </Badge>
            ))}
            <Badge variant="outline" className={`rounded-none uppercase text-[10px] border-foreground ${
              p.verification_status === 'pending' ? 'bg-yellow-600/10 text-yellow-700' :
              p.verification_status === 'rejected' ? 'bg-destructive/10 text-destructive' :
              'bg-military-green/10 text-military-green'
            }`}>
              {p.verification_status === 'pending' ? (isEs ? 'Verificación pendiente' : 'Pending verification')
                : p.verification_status === 'rejected' ? (isEs ? 'Rechazado' : 'Rejected')
                : (isEs ? 'Verificado' : 'Verified')}
            </Badge>
          </div>

          <div className="border-2 border-foreground p-6 mb-8">
            <h2 className="font-bold text-sm uppercase tracking-widest mb-6">{t.profile.personalInfo}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-military-label">{t.auth.firstName}</Label>
                <Input value={p.first_name ?? ''} disabled className="border-2 border-border rounded-none h-11 mt-1 bg-muted" />
              </div>
              <div>
                <Label className="text-military-label">{t.auth.lastName}</Label>
                <Input value={p.last_name ?? ''} disabled className="border-2 border-border rounded-none h-11 mt-1 bg-muted" />
              </div>
              <div>
                <Label className="text-military-label">{t.auth.cedula}</Label>
                <Input value={p.cedula} disabled className="border-2 border-border rounded-none h-11 mt-1 bg-muted font-mono" />
              </div>
              <div>
                <Label className="text-military-label">{t.auth.email}</Label>
                <Input value={p.email ?? ''} disabled className="border-2 border-border rounded-none h-11 mt-1 bg-muted" />
              </div>
              {isStaff ? (
                <>
                  <div>
                    <Label className="text-military-label">{isEs ? 'Grado / Título' : 'Rank / Title'}</Label>
                    <Input value={p.rank ?? ''} disabled className="border-2 border-border rounded-none h-11 mt-1 bg-muted" />
                  </div>
                  <div>
                    <Label className="text-military-label">{isEs ? 'Institución' : 'Institution'}</Label>
                    <Input value={p.institution ?? ''} disabled className="border-2 border-border rounded-none h-11 mt-1 bg-muted" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label className="text-military-label">{t.auth.semester}</Label>
                    <Input value={p.semester ?? ''} disabled className="border-2 border-border rounded-none h-11 mt-1 bg-muted" />
                  </div>
                  <div>
                    <Label className="text-military-label">{t.auth.career}</Label>
                    <Input value={p.career ?? ''} disabled className="border-2 border-border rounded-none h-11 mt-1 bg-muted" />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="border-2 border-foreground p-6">
            <h2 className="font-bold text-sm uppercase tracking-widest mb-6">{t.profile.changePassword}</h2>
            <form className="space-y-4" onSubmit={changePassword}>
              <div>
                <Label className="text-military-label">{t.profile.newPassword}</Label>
                <Input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} className="border-2 border-foreground rounded-none h-11 mt-1" />
              </div>
              <div>
                <Label className="text-military-label">{t.auth.confirmPassword}</Label>
                <Input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} className="border-2 border-foreground rounded-none h-11 mt-1" />
              </div>
              <Button type="submit" disabled={saving} className="font-bold uppercase tracking-widest text-sm rounded-none">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : t.profile.saveChanges}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Profile;
