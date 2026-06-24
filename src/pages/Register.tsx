import { useI18n } from '@/contexts/I18nContext';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { signUpWithCedula } from '@/lib/auth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const Register = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', cedula: '', email: '',
    password: '', confirmPassword: '', semester: '', career: '',
  });

  const careers = lang === 'es'
    ? ['Ingeniería en Sistemas', 'Ingeniería en Telecomunicaciones', 'Ingeniería Petroquímica', 'Turismo', 'Administración de Desastres', 'Militar']
    : ['Systems Engineering', 'Telecommunications Engineering', 'Petrochemical Engineering', 'Tourism', 'Disaster Management', 'Military'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error(lang === 'es' ? 'Las contraseñas no coinciden' : 'Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error(lang === 'es' ? 'La contraseña debe tener al menos 6 caracteres' : 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const { error } = await signUpWithCedula({
      cedula: form.cedula,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      semester: form.semester,
      career: form.career,
      roleRequested: 'student',
      rank: '',
      institution: '',
      credentials: '',
    });
    setLoading(false);
    if (error) {
      toast.error(error.message.includes('already registered')
        ? (lang === 'es' ? 'Esta cédula ya está registrada' : 'This ID is already registered')
        : error.message);
      return;
    }
    toast.success(lang === 'es' ? '¡Cuenta creada!' : 'Account created!');
    navigate('/dashboard');
  };

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <AppLayout>
      <div className="relative bg-[hsl(var(--military-green-pastel))] min-h-[calc(100vh-8rem)]">
        <div className="absolute top-0 left-0 right-0 h-2 bg-military-green" />
        <div className="absolute top-6 right-0 hidden md:flex items-center gap-3 bg-military-green text-white px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] shadow-[4px_4px_0_0_hsl(0_0%_5%)]">
          <span className="w-2 h-2 bg-white" />
          UNEFA · IPM · REGISTRO
        </div>

        <div className="container mx-auto px-4 py-16 flex justify-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-lg"
          >
            <div className="border-2 border-foreground p-8 bg-background shadow-[8px_8px_0_0_hsl(var(--military-green))]">
              <h1 className="text-2xl font-black mb-1">{t.auth.registerTitle}</h1>
              <p className="text-muted-foreground text-sm mb-6">
                {lang === 'es'
                  ? 'Registro de estudiante. Profesores y militares son dados de alta directamente por la administración.'
                  : 'Student registration. Professors and military personnel are enrolled directly by the administration.'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-military-label">{t.auth.firstName}</Label>
                    <Input value={form.firstName} onChange={(e) => update('firstName', e.target.value)}
                      className="border-2 border-foreground rounded-none h-11" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-military-label">{t.auth.lastName}</Label>
                    <Input value={form.lastName} onChange={(e) => update('lastName', e.target.value)}
                      className="border-2 border-foreground rounded-none h-11" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-military-label">{t.auth.cedula}</Label>
                  <Input value={form.cedula} onChange={(e) => update('cedula', e.target.value)}
                    placeholder="V-12345678" className="border-2 border-foreground rounded-none h-11 font-mono" required />
                </div>

                <div className="space-y-2">
                  <Label className="text-military-label">{t.auth.email}</Label>
                  <Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
                    placeholder="correo@unefa.edu.ve" className="border-2 border-foreground rounded-none h-11" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-military-label">{t.auth.semester}</Label>
                    <Select value={form.semester} onValueChange={(v) => update('semester', v)}>
                      <SelectTrigger className="border-2 border-foreground rounded-none h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8,9].map((s) => (
                          <SelectItem key={s} value={String(s)}>{s}° {lang === 'es' ? 'Semestre' : 'Semester'}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-military-label">{t.auth.career}</Label>
                    <Select value={form.career} onValueChange={(v) => update('career', v)}>
                      <SelectTrigger className="border-2 border-foreground rounded-none h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {careers.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-military-label">{t.auth.password}</Label>
                    <Input type="password" value={form.password} onChange={(e) => update('password', e.target.value)}
                      className="border-2 border-foreground rounded-none h-11" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-military-label">{t.auth.confirmPassword}</Label>
                    <Input type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)}
                      className="border-2 border-foreground rounded-none h-11" required />
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full h-11 font-bold uppercase tracking-widest text-sm rounded-none">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t.auth.registerBtn}
                </Button>
              </form>

              <p className="mt-6 text-sm text-center text-muted-foreground">
                {t.auth.hasAccount}{' '}
                <Link to="/login" className="text-foreground font-semibold underline underline-offset-4">
                  {t.nav.login}
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Register;
