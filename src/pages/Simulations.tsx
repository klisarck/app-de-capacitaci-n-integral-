import { useI18n } from '@/contexts/I18nContext';
import AppLayout from '@/components/AppLayout';
import { simulations } from '@/data/simulations';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Clock, AlertTriangle, ChevronRight } from 'lucide-react';

const difficultyConfig = {
  medium: { es: 'Medio', en: 'Medium', color: 'bg-yellow-500' },
  hard: { es: 'Difícil', en: 'Hard', color: 'bg-orange-500' },
  critical: { es: 'Crítico', en: 'Critical', color: 'bg-destructive' },
};

const Simulations = () => {
  const { t, lang } = useI18n();

  return (
    <AppLayout isLoggedIn>
      <div className="container mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="border-b-2 border-foreground pb-6 mb-10">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-military-green" />
              <span className="text-military-label">
                {lang === 'es' ? 'Militares Profesionales' : 'Professional Military'}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black">
              {lang === 'es' ? 'Simulaciones Tácticas' : 'Tactical Simulations'}
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              {lang === 'es'
                ? 'Escenarios de toma de decisiones diseñados para evaluar y mejorar las competencias tácticas, de liderazgo y evaluación de riesgo de militares graduados.'
                : 'Decision-making scenarios designed to evaluate and improve the tactical, leadership, and risk assessment competencies of graduated military personnel.'}
            </p>
          </div>

          {/* Alert banner */}
          <div className="border-2 border-military-green bg-military-green/5 p-4 mb-8 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-military-green shrink-0 mt-0.5" />
            <p className="text-sm">
              {lang === 'es'
                ? 'Estas simulaciones están diseñadas para militares graduados. Sus decisiones serán evaluadas en tres dimensiones: precisión táctica, evaluación de riesgo y liderazgo.'
                : 'These simulations are designed for graduated military personnel. Your decisions will be evaluated across three dimensions: tactical accuracy, risk assessment, and leadership.'}
            </p>
          </div>

          {/* Simulation cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {simulations.map((sim, i) => {
              const diff = difficultyConfig[sim.difficulty];
              return (
                <motion.div
                  key={sim.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={`/simulations/${sim.id}`}
                    className="block border-2 border-foreground hover:border-military-green transition-colors group h-full"
                  >
                    {/* Card header */}
                    <div className="bg-military-green/10 p-4 border-b-2 border-foreground group-hover:border-military-green">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-military-label">{sim.category[lang]}</span>
                        <span className={`${diff.color} text-white text-xs font-bold px-2 py-0.5 uppercase`}>
                          {diff[lang]}
                        </span>
                      </div>
                      <h2 className="text-xl font-black">{sim.title[lang]}</h2>
                    </div>

                    {/* Card body */}
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {sim.description[lang]}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          ~{sim.estimatedTime} min
                        </div>
                        <span className="text-sm font-bold flex items-center gap-1 text-military-green group-hover:gap-2 transition-all">
                          {lang === 'es' ? 'Iniciar' : 'Start'}
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Simulations;
