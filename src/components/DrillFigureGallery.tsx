import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/contexts/I18nContext';
import { ChevronLeft, ChevronRight, Megaphone, Zap, Sparkles } from 'lucide-react';
import VoiceCommandRecorder, { VoiceEvalResult } from './VoiceCommandRecorder';

import pieFirme from '@/assets/drill/firmes.jpg';
import discrecion from '@/assets/drill/descanso.jpg';
import atencionFirme from '@/assets/drill/atencion-firme.jpg';
import izquierda from '@/assets/drill/izquierda.jpg';
import derecha from '@/assets/drill/derecha.jpg';
import saludo from '@/assets/drill/saludo.jpg';

type PosKey = 'pieFirme' | 'discrecion' | 'atencionFirme' | 'izquierda' | 'derecha' | 'saludo';

const order: PosKey[] = ['pieFirme', 'discrecion', 'atencionFirme', 'izquierda', 'derecha', 'saludo'];
const images: Record<PosKey, string> = { pieFirme, discrecion, atencionFirme, izquierda, derecha, saludo };

// Map each voice-command example index to a target position
const exampleToPosition: Record<number, PosKey> = {
  0: 'discrecion',     // A discreción… ¡YA!
  1: 'atencionFirme',  // Atención… ¡FIR!
  2: 'derecha',        // A la derecha… ¡YA!
  3: 'izquierda',      // A la izquierda… ¡YA!
};

const DrillFigureGallery = () => {
  const { t } = useI18n();
  const [current, setCurrent] = useState<PosKey>('pieFirme');
  const [triggered, setTriggered] = useState(false);

  const idx = order.indexOf(current);
  const go = (delta: number) => {
    const next = order[(idx + delta + order.length) % order.length];
    setCurrent(next);
    setTriggered(false);
  };

  const handleEvaluation = (r: VoiceEvalResult) => {
    if (r.status === 'correct') {
      const target = exampleToPosition[r.exampleIndex];
      if (target) {
        setCurrent(target);
        setTriggered(true);
        setTimeout(() => setTriggered(false), 1800);
      }
    }
  };

  return (
    <div className="mt-12 space-y-10">
      {/* Interactive Figure Carousel */}
      <section>
        <div className="border-b-2 border-foreground pb-3 mb-6 flex items-end justify-between">
          <div>
            <p className="text-military-label">{t.drill.subtitle}</p>
            <h2 className="text-2xl font-black">{t.drill.title}</h2>
          </div>
          <span className="text-military-label font-mono">
            {String(idx + 1).padStart(2, '0')} / {String(order.length).padStart(2, '0')}
          </span>
        </div>

        <div className="grid md:grid-cols-[1fr_320px] gap-6">
          {/* Main figure */}
          <div className="relative border-2 border-foreground bg-card overflow-hidden military-stamp-soft">
            <div className="relative aspect-[4/3] md:aspect-auto md:h-[520px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={current}
                  src={images[current]}
                  alt={t.drill.positions[current]}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Triggered overlay flash */}
              <AnimatePresence>
                {triggered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 ring-4 ring-inset ring-military-green pointer-events-none"
                  >
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-military-green text-white px-2.5 py-1 text-[10px] font-black uppercase tracking-widest">
                      <Sparkles className="h-3 w-3" />
                      Ejecutado
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Arrows */}
              <button
                onClick={() => go(-1)}
                aria-label="Previous"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-foreground/80 hover:bg-foreground text-background p-2 transition"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Next"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-foreground/80 hover:bg-foreground text-background p-2 transition"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/85 via-foreground/50 to-transparent p-4 text-background">
                <p className="text-[10px] uppercase tracking-[0.3em] opacity-80">
                  {t.drill.voiceCommands.figureTitle}
                </p>
                <h3 className="text-2xl font-black">{t.drill.positions[current]}</h3>
                <p className="text-xs opacity-90 max-w-xl mt-1">{t.drill.descriptions[current]}</p>
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="grid grid-cols-6 border-t-2 border-foreground">
              {order.map((k, i) => (
                <button
                  key={k}
                  onClick={() => setCurrent(k)}
                  className={`relative aspect-square overflow-hidden border-r border-foreground/30 last:border-r-0 ${
                    current === k ? 'ring-2 ring-inset ring-military-green' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={images[k]} alt={t.drill.positions[k]} className="w-full h-full object-cover" />
                  <span className="absolute top-1 left-1 text-[9px] font-mono bg-foreground/80 text-background px-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Side info */}
          <aside className="border-2 border-foreground p-5 bg-card">
            <p className="text-military-label mb-3">{t.drill.voiceCommands.figureTitle}</p>
            <p className="text-sm leading-relaxed text-foreground/80 mb-4">
              {t.drill.voiceCommands.figureHint}
            </p>
            <div className="border-t-2 border-foreground/20 pt-3 space-y-2">
              {order.map((k) => (
                <div
                  key={k}
                  className={`flex items-center gap-2 text-xs ${
                    current === k ? 'text-military-green font-black' : 'text-muted-foreground'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 ${current === k ? 'bg-military-green' : 'bg-muted-foreground/40'}`}
                  />
                  {t.drill.positions[k]}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* Voice Commands Info */}
      <section>
        <div className="border-b-2 border-foreground pb-3 mb-6">
          <p className="text-military-label">{t.drill.voiceCommands.subtitle}</p>
          <h2 className="text-2xl font-black">{t.drill.voiceCommands.title}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="border-2 border-foreground p-5">
            <div className="flex items-center gap-2 mb-2">
              <Megaphone className="h-5 w-5 text-military-green" />
              <h3 className="font-black uppercase tracking-wide text-sm">
                {t.drill.voiceCommands.preventiveTitle}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.drill.voiceCommands.preventiveDesc}
            </p>
          </div>
          <div className="border-2 border-military-green bg-[hsl(var(--military-green-pastel))] p-5">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-military-green" />
              <h3 className="font-black uppercase tracking-wide text-sm">
                {t.drill.voiceCommands.executiveTitle}
              </h3>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {t.drill.voiceCommands.executiveDesc}
            </p>
          </div>
        </div>

        <div className="border-2 border-foreground p-5 mb-6">
          <p className="text-military-label mb-3">{t.drill.voiceCommands.examplesTitle}</p>
          <div className="space-y-2">
            {t.drill.voiceCommands.examples.map((ex, i) => (
              <div
                key={i}
                className="flex items-baseline gap-3 font-mono text-sm border-b border-border last:border-0 py-1.5"
              >
                <span className="text-muted-foreground w-6">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-muted-foreground">{ex.prev}</span>
                <span className="text-military-green font-black tracking-wider">{ex.exec}</span>
              </div>
            ))}
          </div>
        </div>

        <VoiceCommandRecorder onEvaluation={handleEvaluation} />
      </section>
    </div>
  );
};

export default DrillFigureGallery;
