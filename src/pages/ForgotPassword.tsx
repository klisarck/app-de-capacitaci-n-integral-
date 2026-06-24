import { useI18n } from '@/contexts/I18nContext';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const { t, lang } = useI18n();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <AppLayout>
      <div className="relative bg-[hsl(var(--military-green-pastel))] min-h-[calc(100vh-8rem)]">
        <div className="absolute top-0 left-0 right-0 h-2 bg-military-green" />
        <div className="absolute top-6 right-0 hidden md:flex items-center gap-3 bg-military-green text-white px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] shadow-[4px_4px_0_0_hsl(0_0%_5%)]">
          <span className="w-2 h-2 bg-white" />
          UNEFA · IPM · RECUPERAR
        </div>

        <div className="container mx-auto px-4 py-16 flex justify-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
          <div className="border-2 border-foreground p-8 bg-background shadow-[8px_8px_0_0_hsl(var(--military-green))]">
            <h1 className="text-2xl font-black mb-1">{t.auth.forgotPasswordTitle}</h1>
            <p className="text-muted-foreground text-sm mb-8">{t.auth.forgotPasswordSubtitle}</p>

            {sent ? (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-2 border-foreground mx-auto flex items-center justify-center">
                  <span className="text-xl">✓</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {lang === 'es'
                    ? 'Si el correo está registrado, recibirá instrucciones para restablecer su contraseña.'
                    : 'If the email is registered, you will receive instructions to reset your password.'}
                </p>
                <Link to="/login" className="block text-sm font-semibold underline underline-offset-4">
                  {t.auth.backToLogin}
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-military-label">{t.auth.email}</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@unefa.edu.ve"
                    className="border-2 border-foreground rounded-none h-11"
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-11 font-bold uppercase tracking-widest text-sm rounded-none">
                  {t.auth.sendResetBtn}
                </Button>
                <Link to="/login" className="block text-sm text-center text-muted-foreground hover:text-foreground underline underline-offset-4">
                  {t.auth.backToLogin}
                </Link>
              </form>
            )}
          </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ForgotPassword;
