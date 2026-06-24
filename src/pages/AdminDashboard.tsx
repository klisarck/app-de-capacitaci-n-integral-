import { useI18n } from '@/contexts/I18nContext';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '@/stores/adminStore';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Crosshair, Plus, Trash2, Edit, ShieldCheck, Users, Loader2 } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';

const AdminDashboard = () => {
  const { lang } = useI18n();
  const navigate = useNavigate();
  const { customCourses, customSimulations, deleteCourse, deleteSimulation } = useAdminStore();
  const { isAdmin, isProfessor, isStaff, loading } = useUserRole();
  const isEs = lang === 'es';

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header isLoggedIn />
        <div className="container py-16 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
      </div>
    );
  }

  if (!isStaff) {
    return (
      <div className="min-h-screen bg-background">
        <Header isLoggedIn />
        <div className="container py-16 text-center max-w-md mx-auto">
          <h1 className="text-2xl font-black mb-2">{isEs ? 'Acceso restringido' : 'Access restricted'}</h1>
          <p className="text-sm text-muted-foreground">
            {isEs ? 'Esta sección es para profesores, militares y administradores aprobados.'
                  : 'This section is for approved professors, military and admins.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-black tracking-tight">
            {isEs ? '🎓 Panel de Administración' : '🎓 Admin Panel'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEs ? 'Cree y gestione cursos, lecciones y simulaciones' : 'Create and manage courses, lessons, and simulations'}
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 border-primary/30 cursor-pointer hover:border-primary transition-colors"
            onClick={() => navigate('/admin/courses/new')}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="bg-primary/10 p-3 rounded-lg"><BookOpen className="h-6 w-6 text-primary" /></div>
              <div>
                <h3 className="font-bold">{isEs ? 'Crear Curso' : 'Create Course'}</h3>
              </div>
              <Plus className="h-5 w-5 ml-auto text-muted-foreground" />
            </CardContent>
          </Card>
          <Card className="border-2 border-primary/30 cursor-pointer hover:border-primary transition-colors"
            onClick={() => navigate('/admin/simulations/new')}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="bg-primary/10 p-3 rounded-lg"><Crosshair className="h-6 w-6 text-primary" /></div>
              <div>
                <h3 className="font-bold">{isEs ? 'Crear Simulación' : 'Create Simulation'}</h3>
              </div>
              <Plus className="h-5 w-5 ml-auto text-muted-foreground" />
            </CardContent>
          </Card>
          {(isProfessor || isAdmin) && (
            <Card className="border-2 border-military-green/40 cursor-pointer hover:border-military-green transition-colors"
              onClick={() => navigate('/admin/students')}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="bg-military-green/10 p-3 rounded-lg"><Users className="h-6 w-6 text-military-green" /></div>
                <div>
                  <h3 className="font-bold">{isEs ? 'Progreso Estudiantes' : 'Student Progress'}</h3>
                </div>
              </CardContent>
            </Card>
          )}
          {isAdmin && (
            <Card className="border-2 border-yellow-600/40 cursor-pointer hover:border-yellow-600 transition-colors"
              onClick={() => navigate('/admin/verifications')}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="bg-yellow-600/10 p-3 rounded-lg"><ShieldCheck className="h-6 w-6 text-yellow-700" /></div>
                <div>
                  <h3 className="font-bold">{isEs ? 'Verificaciones' : 'Verifications'}</h3>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Existing courses */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">{isEs ? 'Cursos Creados' : 'Created Courses'} ({customCourses.length})</h2>
          {customCourses.length === 0 ? (
            <p className="text-muted-foreground text-sm">{isEs ? 'Aún no ha creado cursos.' : 'No courses created yet.'}</p>
          ) : (
            <div className="grid gap-3">
              {customCourses.map((c) => (
                <Card key={c.id} className="border-2">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-bold">{c.title[lang]}</h3>
                      <p className="text-xs text-muted-foreground">{c.modules.length} {isEs ? 'módulos' : 'modules'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/admin/courses/${c.id}/edit`)}>
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteCourse(c.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <h2 className="text-xl font-bold">{isEs ? 'Simulaciones Creadas' : 'Created Simulations'} ({customSimulations.length})</h2>
          {customSimulations.length === 0 ? (
            <p className="text-muted-foreground text-sm">{isEs ? 'Aún no ha creado simulaciones.' : 'No simulations created yet.'}</p>
          ) : (
            <div className="grid gap-3">
              {customSimulations.map((s) => (
                <Card key={s.id} className="border-2">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-bold">{s.title[lang]}</h3>
                      <p className="text-xs text-muted-foreground">{s.nodes.length} {isEs ? 'nodos' : 'nodes'}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => deleteSimulation(s.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
