import { useEffect, useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import AppLayout from '@/components/AppLayout';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShieldCheck, ShieldX, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface PendingProfile {
  id: string;
  user_id: string;
  cedula: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role_requested: 'student' | 'professor' | 'military' | 'admin';
  verification_status: string;
  credentials: string | null;
  rank: string | null;
  institution: string | null;
  created_at: string;
}

const AdminVerifications = () => {
  const { lang } = useI18n();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const [rows, setRows] = useState<PendingProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const isEs = lang === 'es';

  const fetchPending = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('verification_status', ['pending', 'rejected'])
      .order('created_at', { ascending: false });
    if (error) toast.error(error.message);
    setRows((data ?? []) as PendingProfile[]);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && !roleLoading && isAdmin) fetchPending();
    else if (!authLoading && !roleLoading) setLoading(false);
  }, [authLoading, roleLoading, isAdmin]);

  if (authLoading || roleLoading) {
    return <AppLayout isLoggedIn><div className="container py-16 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div></AppLayout>;
  }
  if (!user) { navigate('/login'); return null; }
  if (!isAdmin) {
    return (
      <AppLayout isLoggedIn>
        <div className="container mx-auto py-16 text-center max-w-md">
          <ShieldX className="h-10 w-10 mx-auto text-destructive mb-3" />
          <h1 className="text-2xl font-black mb-2">{isEs ? 'Acceso restringido' : 'Access restricted'}</h1>
          <p className="text-sm text-muted-foreground">{isEs ? 'Solo administradores pueden ver esta página.' : 'Admins only.'}</p>
        </div>
      </AppLayout>
    );
  }

  const approve = async (p: PendingProfile) => {
    // 1. assign role
    const { error: roleErr } = await supabase.from('user_roles').insert({
      user_id: p.user_id,
      role: p.role_requested,
      granted_by: user.id,
    });
    if (roleErr && !roleErr.message.includes('duplicate')) {
      toast.error(roleErr.message);
      return;
    }
    // 2. mark profile approved
    const { error: profErr } = await supabase.from('profiles').update({
      verification_status: 'approved',
      verified_at: new Date().toISOString(),
      verified_by: user.id,
    }).eq('id', p.id);
    if (profErr) { toast.error(profErr.message); return; }
    toast.success(isEs ? 'Usuario aprobado' : 'User approved');
    fetchPending();
  };

  const reject = async (p: PendingProfile) => {
    const { error } = await supabase.from('profiles').update({
      verification_status: 'rejected',
      verified_at: new Date().toISOString(),
      verified_by: user.id,
    }).eq('id', p.id);
    if (error) { toast.error(error.message); return; }
    toast.success(isEs ? 'Solicitud rechazada' : 'Request rejected');
    fetchPending();
  };

  return (
    <AppLayout isLoggedIn>
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> {isEs ? 'Volver al panel' : 'Back to admin'}
        </Link>
        <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
          <ShieldCheck className="h-7 w-7 text-military-green" />
          {isEs ? 'Verificaciones pendientes' : 'Pending verifications'}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          {isEs
            ? 'Revise las credenciales aportadas y apruebe o rechace cada solicitud.'
            : 'Review the submitted credentials and approve or reject each request.'}
        </p>

        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">{isEs ? 'No hay solicitudes.' : 'No requests.'}</p>
        ) : (
          <div className="space-y-4">
            {rows.map((p) => (
              <Card key={p.id} className="border-2 border-foreground rounded-none">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-lg">{p.first_name} {p.last_name}</h3>
                        <Badge variant="outline" className="rounded-none border-foreground uppercase text-[10px]">
                          {p.role_requested === 'professor' ? (isEs ? 'Profesor' : 'Professor')
                            : p.role_requested === 'military' ? (isEs ? 'Militar' : 'Military')
                            : p.role_requested}
                        </Badge>
                        <Badge className={`rounded-none uppercase text-[10px] ${p.verification_status === 'rejected' ? 'bg-destructive' : 'bg-yellow-600'}`}>
                          {p.verification_status === 'rejected' ? (isEs ? 'Rechazado' : 'Rejected') : (isEs ? 'Pendiente' : 'Pending')}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">{p.cedula} · {p.email}</p>
                    </div>
                  </div>
                  <dl className="grid sm:grid-cols-2 gap-3 text-sm border-t border-border pt-3">
                    <div>
                      <dt className="text-military-label">{isEs ? 'Grado / Título' : 'Rank / Title'}</dt>
                      <dd className="font-semibold">{p.rank || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-military-label">{isEs ? 'Institución' : 'Institution'}</dt>
                      <dd className="font-semibold">{p.institution || '—'}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-military-label">{isEs ? 'Credenciales' : 'Credentials'}</dt>
                      <dd className="whitespace-pre-wrap">{p.credentials || '—'}</dd>
                    </div>
                  </dl>
                  {p.verification_status !== 'rejected' && (
                    <div className="flex gap-2 mt-4">
                      <Button onClick={() => approve(p)} className="rounded-none font-bold uppercase tracking-widest text-xs">
                        <ShieldCheck className="h-4 w-4 mr-1.5" /> {isEs ? 'Aprobar' : 'Approve'}
                      </Button>
                      <Button onClick={() => reject(p)} variant="outline" className="rounded-none border-2 border-destructive text-destructive font-bold uppercase tracking-widest text-xs">
                        <ShieldX className="h-4 w-4 mr-1.5" /> {isEs ? 'Rechazar' : 'Reject'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default AdminVerifications;
