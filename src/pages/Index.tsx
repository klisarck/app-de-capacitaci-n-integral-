import { useI18n } from '@/contexts/I18nContext';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Shield, Award, ChevronRight } from 'lucide-react';

const Landing = () => {
  const { t, lang } = useI18n();

  const features = [
    { icon: BookOpen, titleEs: 'Contenido Interactivo', titleEn: 'Interactive Content', descEs: 'Lecciones multimedia con texto, video y evaluaciones', descEn: 'Multimedia lessons with text, video and assessments' },
    { icon: Shield, titleEs: 'Capacitación Integral', titleEn: 'Comprehensive Training', descEs: 'Historia militar, leyes y orden cerrado', descEn: 'Military history, laws and close order drill' },
    { icon: Award, titleEs: 'Seguimiento de Progreso', titleEn: 'Progress Tracking', descEs: 'Monitorea tu avance en cada curso', descEn: 'Monitor your progress in each course' },
  ];

  return (
    <AppLayout>
      {/* Hero */}
      <section className="border-b-2 border-foreground military-stamp-soft relative overflow-hidden">
        {/* Decorative chevrons in corner */}
        <div className="absolute top-0 right-0 hidden md:block opacity-30 pointer-events-none">
          <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 80 L110 30 L180 80" stroke="hsl(var(--military-green))" strokeWidth="6" fill="none"/>
            <path d="M40 130 L110 80 L180 130" stroke="hsl(var(--military-green))" strokeWidth="6" fill="none"/>
            <path d="M40 180 L110 130 L180 180" stroke="hsl(var(--military-green))" strokeWidth="6" fill="none"/>
          </svg>
        </div>

        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 border-2 border-military-green bg-background/60 backdrop-blur-sm">
              <span className="h-2 w-2 bg-military-green animate-pulse" />
              <p className="text-military-label !text-foreground">
                {lang === 'es' ? 'UNIVERSIDAD NACIONAL EXPERIMENTAL POLITÉCNICA DE LA FUERZA ARMADA' : 'NATIONAL EXPERIMENTAL POLYTECHNIC UNIVERSITY OF THE ARMED FORCES'}
              </p>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.9] mb-6">
              {lang === 'es' ? 'Academia de Capacitación Integral' : 'Pre-Military Instruction'}
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 max-w-xl mb-10">
              {t.app.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="font-bold uppercase tracking-widest text-sm w-full sm:w-auto bg-military-green hover:bg-military-green/90 text-white">
                  {t.nav.register}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-2 border-foreground bg-background font-bold uppercase tracking-widest text-sm w-full sm:w-auto">
                  {t.nav.login}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom military stamp band */}
        <div className="military-stamp h-4 w-full border-t-2 border-foreground" />
      </section>

      {/* Features */}
      <section className="border-b-2 border-foreground">
        <div className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-3 gap-0 md:divide-x-2 divide-foreground">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                className="p-8 md:first:pl-0 md:last:pr-0"
              >
                <feat.icon className="h-8 w-8 mb-4" strokeWidth={2} />
                <h3 className="font-heading font-bold text-lg mb-2">
                  {lang === 'es' ? feat.titleEs : feat.titleEn}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {lang === 'es' ? feat.descEs : feat.descEn}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            {lang === 'es' ? '¿Listo para comenzar?' : 'Ready to start?'}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {lang === 'es'
              ? 'Regístrate y accede a todos los cursos  de Capacitación Integral.'
              : 'Register and access all pre-military instruction courses.'}
          </p>
          <Link to="/register">
            <Button size="lg" className="font-bold uppercase tracking-widest text-sm">
              {t.nav.register}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </AppLayout>
  );
};

export default Landing;
