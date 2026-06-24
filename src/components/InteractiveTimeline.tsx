import { useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Swords, Mountain, Flag, MapPin, Star, Shield, Footprints } from 'lucide-react';

export interface TimelineEvent {
  year: string;
  title: { es: string; en: string };
  description: { es: string; en: string };
  icon?: string;
}

interface InteractiveTimelineProps {
  events: TimelineEvent[];
  title: { es: string; en: string };
}

const iconMap: Record<string, React.ReactNode> = {
  '⚔️': <Swords className="h-4 w-4" />,
  '🏔️': <Mountain className="h-4 w-4" />,
  '🚩': <Flag className="h-4 w-4" />,
  '📍': <MapPin className="h-4 w-4" />,
  '⭐': <Star className="h-4 w-4" />,
  '🛡️': <Shield className="h-4 w-4" />,
  '🥾': <Footprints className="h-4 w-4" />,
};

const InteractiveTimeline = ({ events, title }: InteractiveTimelineProps) => {
  const { lang } = useI18n();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="my-8 border-2 border-foreground p-6 bg-card">
      <h3 className="text-lg font-black mb-6 flex items-center gap-2">
        <span className="w-3 h-3 bg-military-green inline-block" />
        {title[lang]}
      </h3>

      <div className="relative">
        {/* Vertical line with gradient */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-military-green via-military-green/60 to-military-green/20" />

        <div className="space-y-1">
          {events.map((event, i) => {
            const isActive = activeIndex === i;
            const iconKey = event.icon || '';
            const hasLucideIcon = iconMap[iconKey];
            const progress = ((i + 1) / events.length) * 100;

            return (
              <div key={i}>
                <button
                  onClick={() => setActiveIndex(isActive ? null : i)}
                  className="relative flex items-start gap-4 w-full text-left p-3 hover:bg-muted/50 transition-colors group"
                >
                  {/* Animated connector pulse */}
                  {isActive && (
                    <motion.div
                      className="absolute left-[14px] top-[18px] w-3 h-3 rounded-full bg-military-green/30"
                      animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  {/* Dot with icon */}
                  <motion.div 
                    className={`relative z-10 mt-1 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors shrink-0 ${
                      isActive 
                        ? 'bg-military-green border-military-green text-white' 
                        : 'bg-background border-foreground text-foreground group-hover:border-military-green'
                    }`}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {hasLucideIcon ? iconMap[iconKey] : (event.icon || (i + 1))}
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    <span className="text-military-label text-xs font-mono">{event.year}</span>
                    <p className="font-bold text-sm mt-0.5">{event.title[lang]}</p>
                  </div>

                  <motion.div
                    animate={{ rotate: isActive ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 shrink-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-16 mr-4 pb-4 text-sm text-muted-foreground leading-relaxed border-l-2 border-military-green pl-4">
                        {event.description[lang]}
                        {/* Progress indicator */}
                        <div className="mt-3 flex items-center gap-2">
                          <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-military-green rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground">{i + 1}/{events.length}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InteractiveTimeline;
