import { useI18n } from '@/contexts/I18nContext';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { signInWithCedula } from '@/lib/auth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signInWithCedula(cedula, password);
    setLoading(false);
    if (error) {
      toast.error(error.message === 'Invalid login credentials'
        ? 'Cédula o contraseña incorrecta'
        : error.message);
      return;
    }
    toast.success('¡Bienvenido!');
    navigate('/dashboard');
  };

  return (
    <AppLayout>
      <div className="relative bg-[hsl(var(--military-green-pastel))] min-h-[calc(100vh-8rem)]">
        <div className="absolute top-0 left-0 right-0 h-2 bg-military-green" />
        <div className="absolute top-6 right-0 hidden md:flex items-center gap-3 bg-military-green text-white px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] shadow-[4px_4px_0_0_hsl(0_0%_5%)]">
          <span className="w-2 h-2 bg-white" />
          UNEFA · IPM · ACCESO
        </div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-military-green/10 -translate-x-12 translate-y-12 rotate-45 hidden md:block" />

        <div className="container mx-auto px-4 py-16 flex justify-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            <div className="border-2 border-foreground p-8 bg-background shadow-[8px_8px_0_0_hsl(var(--military-green))]">
              <h1 className="text-2xl font-black mb-1">{t.auth.loginTitle}</h1>
              <p className="text-muted-foreground text-sm mb-8">{t.auth.loginSubtitle}</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="cedula" className="text-military-label">{t.auth.cedula}</Label>
                  <Input
                    id="cedula"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    placeholder="V-12345678"
                    className="border-2 border-foreground rounded-none h-11 font-mono"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-military-label">{t.auth.password}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-2 border-foreground rounded-none h-11"
                    required
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full h-11 font-bold uppercase tracking-widest text-sm rounded-none">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t.auth.loginBtn}
                </Button>
              </form>

              <div className="mt-6 space-y-3 text-sm text-center">
                <Link to="/forgot-password" className="block text-muted-foreground hover:text-foreground underline underline-offset-4">
                  {t.auth.forgotPassword}
                </Link>
                <p className="text-muted-foreground">
                  {t.auth.noAccount}{' '}
                  <Link to="/register" className="text-foreground font-semibold underline underline-offset-4">
                    {t.nav.register}
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Login;
