import { useEffect, useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import AppLayout from '@/components/AppLayout';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Loader2, ShieldX, Users, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { sampleCourses } from '@/data/courses';

interface StudentRow {
  id: string;
  user_id: string;
  cedula: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  semester: string | null;
  career: string | null;
}
interface ProgressRow {
  user_id: string;
  course_id: string;
  completed: boolean;
  quiz_score: number | null;
  quiz_total: number | null;
}

const totalLessonsPerCourse = sampleCourses.reduce<Record<string, number>>((acc, c) => {
  acc[c.id] = c.modules.reduce((s, m) => s + m.lessons.length, 0);
  return acc;
}, {});

const AdminStudentProgress = () => {
  const { lang } = useI18n();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isProfessor, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const isEs = lang === 'es';
  const allowed = isAdmin || isProfessor;

  useEffect(() => {
    if (authLoading || roleLoading) return;
    if (!allowed) { setLoading(false); return; }
    (async () => {
      // Students = approved profiles whose role_requested = student (or whose role IS student)
      const [profilesRes, progressRes] = await Promise.all([
        supabase.from('profiles')
          .select('id, user_id, cedula, first_name, last_name, email, semester, career, role_requested, verification_status')
          .eq('role_requested', 'student')
          .eq('verification_status', 'approved'),
        supabase.from('lesson_progress')
          .select('user_id, course_id, completed, quiz_score, quiz_total'),
      ]);
      setStudents((profilesRes.data ?? []) as StudentRow[]);
      setProgress((progressRes.data ?? []) as ProgressRow[]);
      setLoading(false);
    })();
  }, [authLoading, roleLoading, allowed]);

  if (authLoading || roleLoading) {
    return <AppLayout isLoggedIn><div className="container py-16 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div></AppLayout>;
  }
  if (!user) { navigate('/login'); return null; }
  if (!allowed) {
    return (
      <AppLayout isLoggedIn>
        <div className="container mx-auto py-16 text-center max-w-md">
          <ShieldX className="h-10 w-10 mx-auto text-destructive mb-3" />
          <h1 className="text-2xl font-black mb-2">{isEs ? 'Acceso restringido' : 'Access restricted'}</h1>
          <p className="text-sm text-muted-foreground">{isEs ? 'Solo profesores y administradores.' : 'Professors and admins only.'}</p>
        </div>
      </AppLayout>
    );
  }

  const filtered = students.filter((s) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [s.first_name, s.last_name, s.cedula, s.email].some((v) => v?.toLowerCase().includes(q));
  });

  const overall = (uid: string) => {
    const totalLessons = Object.values(totalLessonsPerCourse).reduce((a, b) => a + b, 0);
    const done = progress.filter((r) => r.user_id === uid && r.completed).length;
    return totalLessons === 0 ? 0 : Math.round((done / totalLessons) * 100);
  };

  return (
    <AppLayout isLoggedIn>
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> {isEs ? 'Volver al panel' : 'Back to admin'}
        </Link>
        <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
          <Users className="h-7 w-7 text-military-green" />
          {isEs ? 'Progreso de estudiantes' : 'Student progress'}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          {isEs ? `${students.length} estudiantes registrados` : `${students.length} registered students`}
        </p>

        <Input
          placeholder={isEs ? 'Buscar por nombre, cédula o correo...' : 'Search by name, ID or email...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-2 border-foreground rounded-none h-11 mb-6"
        />

        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">{isEs ? 'Sin estudiantes.' : 'No students.'}</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((s) => {
              const pct = overall(s.user_id);
              return (
                <Card key={s.id} className="border-2 border-foreground rounded-none">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-bold">{s.first_name} {s.last_name}</h3>
                        <p className="text-xs text-muted-foreground font-mono">
                          {s.cedula} · {s.career || '—'} {s.semester ? `· ${s.semester}° sem` : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-military-green">{pct}%</p>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{isEs ? 'Total' : 'Overall'}</p>
                      </div>
                    </div>
                    <Progress value={pct} className="h-2 rounded-none" />
                    <div className="grid sm:grid-cols-3 gap-3 mt-4 text-xs">
                      {sampleCourses.map((c) => {
                        const total = totalLessonsPerCourse[c.id] || 0;
                        const done = progress.filter((r) => r.user_id === s.user_id && r.course_id === c.id && r.completed).length;
                        const cpct = total === 0 ? 0 : Math.round((done / total) * 100);
                        return (
                          <div key={c.id} className="border border-border p-2">
                            <p className="font-semibold truncate">{c.title[lang]}</p>
                            <p className="text-muted-foreground font-mono">{done}/{total} · {cpct}%</p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default AdminStudentProgress;
