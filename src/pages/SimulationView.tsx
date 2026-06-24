import { useState, useEffect, useRef } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import AppLayout from '@/components/AppLayout';
import { simulations } from '@/data/simulations';
import SimulationReport from '@/components/SimulationReport';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';

const SimulationView = () => {
  const { lang } = useI18n();
  const { scenarioId } = useParams();
  const navigate = useNavigate();

  const simulation = simulations.find(s => s.id === scenarioId);

  const [currentNodeId, setCurrentNodeId] = useState(simulation?.startNodeId || '');
  const [scores, setScores] = useState<{ tactical: number; risk: number; leadership: number }[]>([]);
  const [startTime] = useState(Date.now());
  const [stepStart, setStepStart] = useState(Date.now());
  const [finished, setFinished] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentNode = simulation?.nodes.find(n => n.id === currentNodeId);

  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [currentNodeId, finished]);

  if (!simulation || !currentNode) {
    return (
      <AppLayout isLoggedIn>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">{lang === 'es' ? 'Simulación no encontrada' : 'Simulation not found'}</p>
        </div>
      </AppLayout>
    );
  }

  const handleChoice = (optionIndex: number) => {
    const option = currentNode.options![optionIndex];
    const newScores = [...scores, option.scores];
    setScores(newScores);

    const nextNode = simulation.nodes.find(n => n.id === option.nextNodeId);
    if (nextNode?.isFinal) {
      setCurrentNodeId(option.nextNodeId);
      setTotalTime(Math.round((Date.now() - startTime) / 1000));
      setFinished(true);
    } else {
      setCurrentNodeId(option.nextNodeId);
      setStepStart(Date.now());
    }
  };

  const handleRestart = () => {
    setCurrentNodeId(simulation.startNodeId);
    setScores([]);
    setFinished(false);
  };

  const stepNumber = scores.length + 1;

  return (
    <AppLayout isLoggedIn>
      <div ref={containerRef} className="container mx-auto px-4 py-10 max-w-3xl">
        <Link
          to="/simulations"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {lang === 'es' ? 'Volver a Simulaciones' : 'Back to Simulations'}
        </Link>

        <div className="border-b-2 border-foreground pb-4 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-5 w-5 text-military-green" />
            <span className="text-military-label">{simulation.category[lang]}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black">{simulation.title[lang]}</h1>
        </div>

        {finished ? (
          <>
            {/* Show final node situation */}
            <div className="border-2 border-foreground p-6 mb-8 bg-card">
              <p className="text-sm leading-relaxed whitespace-pre-line">{currentNode.situation[lang]}</p>
              {currentNode.outcome && (
                <p className="mt-4 font-bold text-sm border-t border-border pt-3">
                  {currentNode.outcome[lang]}
                </p>
              )}
            </div>
            <SimulationReport
              scores={scores}
              totalTime={totalTime}
              onRestart={handleRestart}
              onBack={() => navigate('/simulations')}
            />
          </>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentNodeId}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-military-green text-white text-xs font-bold px-2 py-1">
                  {lang === 'es' ? `DECISIÓN ${stepNumber}` : `DECISION ${stepNumber}`}
                </span>
                {scores.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {lang === 'es' ? `${scores.length} decisiones tomadas` : `${scores.length} decisions made`}
                  </span>
                )}
              </div>

              {/* Situation */}
              <div className="border-2 border-foreground p-6 mb-6 bg-card">
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {currentNode.situation[lang]}
                </p>
              </div>

              {/* Options */}
              {currentNode.options && (
                <div className="space-y-3">
                  <p className="text-military-label">
                    {lang === 'es' ? '¿Qué decisión toma?' : 'What is your decision?'}
                  </p>
                  {currentNode.options.map((option, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleChoice(i)}
                      className="w-full text-left border-2 border-foreground p-4 hover:border-military-green hover:bg-military-green/5 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="bg-foreground text-background w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0 group-hover:bg-military-green">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <p className="text-sm leading-relaxed">{option.text[lang]}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </AppLayout>
  );
};

export default SimulationView;
