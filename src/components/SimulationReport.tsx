import { useI18n } from '@/contexts/I18nContext';
import { motion } from 'framer-motion';
import { Shield, Target, Users, TrendingUp } from 'lucide-react';

interface ScoreData {
  tactical: number;
  risk: number;
  leadership: number;
}

interface SimulationReportProps {
  scores: ScoreData[];
  totalTime: number; // seconds
  onRestart: () => void;
  onBack: () => void;
}

const SimulationReport = ({ scores, totalTime, onRestart, onBack }: SimulationReportProps) => {
  const { lang } = useI18n();

  // Average scores across all decisions
  const avg = {
    tactical: Math.round(scores.reduce((a, s) => a + s.tactical, 0) / scores.length),
    risk: Math.round(scores.reduce((a, s) => a + s.risk, 0) / scores.length),
    leadership: Math.round(scores.reduce((a, s) => a + s.leadership, 0) / scores.length),
  };
  const overall = Math.round((avg.tactical + avg.risk + avg.leadership) / 3);

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const getGrade = (score: number) => {
    if (score >= 90) return { label: lang === 'es' ? 'Excelente' : 'Excellent', color: 'text-green-600' };
    if (score >= 70) return { label: lang === 'es' ? 'Bueno' : 'Good', color: 'text-military-green' };
    if (score >= 50) return { label: lang === 'es' ? 'Regular' : 'Average', color: 'text-yellow-600' };
    return { label: lang === 'es' ? 'Deficiente' : 'Poor', color: 'text-destructive' };
  };

  const grade = getGrade(overall);

  const categories = [
    {
      key: 'tactical',
      label: lang === 'es' ? 'Precisión Táctica' : 'Tactical Accuracy',
      icon: Target,
      value: avg.tactical,
    },
    {
      key: 'risk',
      label: lang === 'es' ? 'Evaluación de Riesgo' : 'Risk Assessment',
      icon: Shield,
      value: avg.risk,
    },
    {
      key: 'leadership',
      label: lang === 'es' ? 'Liderazgo' : 'Leadership',
      icon: Users,
      value: avg.leadership,
    },
  ];

  // Radar chart points
  const radarSize = 200;
  const center = radarSize / 2;
  const radius = 70;
  const angles = [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6];
  const getPoint = (angle: number, value: number) => ({
    x: center + (radius * value / 100) * Math.cos(angle),
    y: center + (radius * value / 100) * Math.sin(angle),
  });

  const radarPoints = [
    getPoint(angles[0], avg.tactical),
    getPoint(angles[1], avg.risk),
    getPoint(angles[2], avg.leadership),
  ];
  const radarPath = radarPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center border-b-2 border-foreground pb-6">
        <TrendingUp className="h-10 w-10 mx-auto mb-3 text-military-green" />
        <h2 className="text-2xl font-black">
          {lang === 'es' ? 'Informe de Desempeño' : 'Performance Report'}
        </h2>
        <p className="text-military-label mt-2">
          {lang === 'es' ? 'Tiempo total de decisión' : 'Total decision time'}: {formatTime(totalTime)}
        </p>
      </div>

      {/* Overall score */}
      <div className="text-center">
        <div className="inline-flex flex-col items-center border-2 border-foreground p-8">
          <span className="text-military-label mb-2">
            {lang === 'es' ? 'Puntuación General' : 'Overall Score'}
          </span>
          <span className="text-6xl font-black">{overall}%</span>
          <span className={`text-lg font-bold mt-1 ${grade.color}`}>{grade.label}</span>
        </div>
      </div>

      {/* Radar chart */}
      <div className="flex justify-center">
        <svg width={radarSize} height={radarSize} className="overflow-visible">
          {/* Grid */}
          {[25, 50, 75, 100].map(level => {
            const pts = angles.map(a => getPoint(a, level));
            return (
              <polygon
                key={level}
                points={pts.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth={1}
              />
            );
          })}
          {/* Axes */}
          {angles.map((a, i) => {
            const end = getPoint(a, 100);
            return <line key={i} x1={center} y1={center} x2={end.x} y2={end.y} stroke="hsl(var(--border))" strokeWidth={1} />;
          })}
          {/* Data */}
          <motion.polygon
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            points={radarPoints.map(p => `${p.x},${p.y}`).join(' ')}
            fill="hsl(var(--military-green) / 0.2)"
            stroke="hsl(var(--military-green))"
            strokeWidth={2}
          />
          {/* Labels */}
          {categories.map((cat, i) => {
            const labelPoint = getPoint(angles[i], 130);
            return (
              <text
                key={cat.key}
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={10}
                fontWeight="bold"
                fill="currentColor"
              >
                {cat.label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Score bars */}
      <div className="space-y-4">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          const catGrade = getGrade(cat.value);
          return (
            <div key={cat.key} className="border-2 border-foreground p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  <span className="font-bold text-sm">{cat.label}</span>
                </div>
                <span className={`font-bold text-sm ${catGrade.color}`}>
                  {cat.value}% — {catGrade.label}
                </span>
              </div>
              <div className="w-full h-3 bg-muted border border-foreground">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.value}%` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                  className="h-full bg-military-green"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center pt-4">
        <button
          onClick={onRestart}
          className="border-2 border-foreground px-6 py-3 font-bold text-sm uppercase tracking-widest hover:bg-muted transition-colors"
        >
          {lang === 'es' ? 'Reintentar' : 'Retry'}
        </button>
        <button
          onClick={onBack}
          className="bg-military-green text-white px-6 py-3 font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          {lang === 'es' ? 'Volver a Simulaciones' : 'Back to Simulations'}
        </button>
      </div>
    </motion.div>
  );
};

export default SimulationReport;
