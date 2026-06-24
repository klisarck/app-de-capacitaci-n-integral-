import { useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { motion } from 'framer-motion';

interface TroopMovement {
  id: string;
  label: { es: string; en: string };
  description: { es: string; en: string };
  path: string;
  color: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface MapLocation {
  id: string;
  label: { es: string; en: string };
  x: number;
  y: number;
  type: 'city' | 'battlefield' | 'camp';
}

interface BattleMapProps {
  title: { es: string; en: string };
  movements: TroopMovement[];
  locations: MapLocation[];
  width?: number;
  height?: number;
}

const BattleMap = ({ title, movements, locations, width = 600, height = 400 }: BattleMapProps) => {
  const { lang } = useI18n();
  const [activeMovement, setActiveMovement] = useState<string | null>(null);
  const [activeLocation, setActiveLocation] = useState<string | null>(null);

  const activeMove = movements.find(m => m.id === activeMovement);
  const activeLoc = locations.find(l => l.id === activeLocation);

  return (
    <div className="my-8 border-2 border-foreground bg-card overflow-hidden">
      <div className="p-4 border-b-2 border-foreground bg-military-green/5">
        <h3 className="text-lg font-black flex items-center gap-2">
          <span className="w-3 h-3 bg-military-green inline-block" />
          {title[lang]}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {lang === 'es' ? 'Haz clic en los elementos para ver detalles' : 'Click elements to see details'}
        </p>
      </div>

      <div className="relative overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ minHeight: 300 }}>
          <defs>
            {/* Terrain texture patterns */}
            <pattern id="grass" patternUnits="userSpaceOnUse" width="20" height="20">
              <rect width="20" height="20" fill="hsl(95, 30%, 78%)" />
              <line x1="3" y1="18" x2="3" y2="14" stroke="hsl(100, 35%, 65%)" strokeWidth="0.6" />
              <line x1="10" y1="19" x2="10" y2="15" stroke="hsl(100, 35%, 62%)" strokeWidth="0.5" />
              <line x1="17" y1="17" x2="17" y2="13" stroke="hsl(100, 35%, 68%)" strokeWidth="0.6" />
              <line x1="7" y1="8" x2="7" y2="4" stroke="hsl(100, 35%, 64%)" strokeWidth="0.5" />
              <line x1="14" y1="9" x2="14" y2="5" stroke="hsl(100, 35%, 66%)" strokeWidth="0.6" />
            </pattern>
            <pattern id="water" patternUnits="userSpaceOnUse" width="30" height="8">
              <rect width="30" height="8" fill="hsl(200, 50%, 72%)" />
              <path d="M0 4 Q7.5 2 15 4 Q22.5 6 30 4" stroke="hsl(200, 55%, 62%)" fill="none" strokeWidth="0.8" opacity="0.6" />
            </pattern>
            <pattern id="hills" patternUnits="userSpaceOnUse" width="40" height="25">
              <rect width="40" height="25" fill="hsl(90, 25%, 70%)" />
              <path d="M0 20 Q10 8 20 20" fill="hsl(95, 22%, 64%)" opacity="0.5" />
              <path d="M20 22 Q30 12 40 22" fill="hsl(95, 22%, 62%)" opacity="0.4" />
            </pattern>
            <radialGradient id="fogOfWar" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="transparent" />
              <stop offset="100%" stopColor="hsl(40, 20%, 90%)" stopOpacity="0.4" />
            </radialGradient>
            <filter id="shadow">
              <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodOpacity="0.3" />
            </filter>
            {/* Arrow markers */}
            {movements.map(m => (
              <marker key={`arrow-${m.id}`} id={`arrow-${m.id}`} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill={m.color} />
              </marker>
            ))}
          </defs>

          {/* Base terrain */}
          <rect width={width} height={height} fill="url(#grass)" />

          {/* Topographic contour lines */}
          <ellipse cx={320} cy={160} rx={200} ry={90} fill="none" stroke="hsl(90, 20%, 65%)" strokeWidth="0.5" opacity="0.4" />
          <ellipse cx={320} cy={160} rx={150} ry={60} fill="none" stroke="hsl(90, 20%, 62%)" strokeWidth="0.5" opacity="0.3" />
          <ellipse cx={320} cy={160} rx={100} ry={35} fill="none" stroke="hsl(90, 20%, 60%)" strokeWidth="0.5" opacity="0.25" />

          {/* Hills / elevated terrain */}
          <ellipse cx={350} cy={140} rx={80} ry={40} fill="url(#hills)" opacity="0.6" />
          <ellipse cx={480} cy={100} rx={50} ry={25} fill="url(#hills)" opacity="0.5" />
          <ellipse cx={150} cy={280} rx={60} ry={30} fill="url(#hills)" opacity="0.4" />

          {/* River / water feature */}
          <path d="M 0 180 Q 80 160 150 200 Q 220 240 300 210 Q 400 170 500 190 Q 560 200 600 180" 
            fill="none" stroke="hsl(200, 50%, 65%)" strokeWidth="8" opacity="0.7" strokeLinecap="round" />
          <path d="M 0 180 Q 80 160 150 200 Q 220 240 300 210 Q 400 170 500 190 Q 560 200 600 180" 
            fill="none" stroke="hsl(200, 60%, 75%)" strokeWidth="4" opacity="0.5" strokeLinecap="round" />

          {/* Roads */}
          <path d="M 150 370 Q 250 320 350 280 Q 420 250 500 200 L 560 160" 
            fill="none" stroke="hsl(35, 30%, 65%)" strokeWidth="5" strokeDasharray="none" opacity="0.5" />
          <path d="M 150 370 Q 250 320 350 280 Q 420 250 500 200 L 560 160" 
            fill="none" stroke="hsl(35, 25%, 75%)" strokeWidth="2" strokeDasharray="8 6" opacity="0.7" />

          {/* Tree clusters */}
          {[
            [50, 150], [70, 170], [40, 200], [420, 80], [440, 95], [460, 75],
            [520, 280], [540, 300], [500, 310], [200, 100], [220, 110], [180, 120],
          ].map(([cx, cy], i) => (
            <g key={`tree-${i}`} opacity="0.6">
              <circle cx={cx} cy={cy} r={8} fill="hsl(120, 35%, 40%)" />
              <circle cx={cx} cy={(cy as number) - 2} r={6} fill="hsl(120, 40%, 48%)" />
              <circle cx={cx} cy={(cy as number) - 4} r={4} fill="hsl(120, 45%, 55%)" />
            </g>
          ))}

          {/* Fog of war overlay */}
          <rect width={width} height={height} fill="url(#fogOfWar)" />

          {/* Grid overlay (subtle) */}
          {Array.from({ length: 13 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={height} stroke="hsl(0, 0%, 50%)" strokeWidth={0.2} opacity="0.15" />
          ))}
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 50} x2={width} y2={i * 50} stroke="hsl(0, 0%, 50%)" strokeWidth={0.2} opacity="0.15" />
          ))}

          {/* Movement paths with animated arrows */}
          {movements.map((move) => {
            const isActive = activeMovement === move.id;
            return (
              <g key={move.id}>
                {/* Path shadow */}
                <path d={move.path} stroke="rgba(0,0,0,0.2)" strokeWidth={isActive ? 6 : 4} fill="none" strokeLinecap="round" />
                {/* Main path */}
                <motion.path
                  d={move.path}
                  stroke={isActive ? move.color : `${move.color}99`}
                  strokeWidth={isActive ? 4 : 3}
                  fill="none"
                  strokeDasharray="10 5"
                  strokeLinecap="round"
                  markerEnd={`url(#arrow-${move.id})`}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.5, delay: 0.3, ease: "easeInOut" }}
                  className="cursor-pointer"
                  onClick={() => setActiveMovement(isActive ? null : move.id)}
                  filter={isActive ? "url(#shadow)" : undefined}
                />
                {/* Start marker - military unit symbol */}
                <g className="cursor-pointer" onClick={() => setActiveMovement(move.id)}>
                  <rect x={move.startX - 10} y={move.startY - 8} width={20} height={16} rx={2} fill={move.color} stroke="white" strokeWidth="1.5" filter="url(#shadow)" />
                  <text x={move.startX} y={move.startY + 4} textAnchor="middle" fontSize={8} fontWeight="bold" fill="white">▮</text>
                </g>
                {/* End marker - target */}
                <g className="cursor-pointer" onClick={() => setActiveMovement(move.id)}>
                  <circle cx={move.endX} cy={move.endY} r={8} fill="white" stroke={move.color} strokeWidth={3} filter="url(#shadow)" />
                  <circle cx={move.endX} cy={move.endY} r={3} fill={move.color} />
                </g>
              </g>
            );
          })}

          {/* Locations with detailed icons */}
          {locations.map((loc) => {
            const isActive = activeLocation === loc.id;
            return (
              <g key={loc.id} className="cursor-pointer" onClick={() => setActiveLocation(isActive ? null : loc.id)} filter="url(#shadow)">
                {loc.type === 'city' && (
                  <g>
                    <rect x={loc.x - 8} y={loc.y - 10} width={16} height={14} fill="hsl(30, 40%, 55%)" stroke="hsl(30, 30%, 40%)" strokeWidth="1" />
                    <polygon points={`${loc.x - 10},${loc.y - 10} ${loc.x},${loc.y - 18} ${loc.x + 10},${loc.y - 10}`} fill="hsl(0, 50%, 45%)" stroke="hsl(0, 40%, 35%)" strokeWidth="0.5" />
                    <rect x={loc.x - 2} y={loc.y - 6} width={4} height={6} fill="hsl(30, 20%, 40%)" />
                  </g>
                )}
                {loc.type === 'battlefield' && (
                  <g>
                    <circle cx={loc.x} cy={loc.y} r={12} fill="none" stroke="hsl(0, 70%, 50%)" strokeWidth="2" strokeDasharray="4 2" />
                    <line x1={loc.x - 6} y1={loc.y - 6} x2={loc.x + 6} y2={loc.y + 6} stroke="hsl(0, 70%, 50%)" strokeWidth="2" />
                    <line x1={loc.x + 6} y1={loc.y - 6} x2={loc.x - 6} y2={loc.y + 6} stroke="hsl(0, 70%, 50%)" strokeWidth="2" />
                  </g>
                )}
                {loc.type === 'camp' && (
                  <g>
                    <polygon points={`${loc.x},${loc.y - 12} ${loc.x + 10},${loc.y + 4} ${loc.x - 10},${loc.y + 4}`} fill="hsl(120, 30%, 35%)" stroke="hsl(120, 25%, 25%)" strokeWidth="1" />
                    <line x1={loc.x} y1={loc.y - 14} x2={loc.x} y2={loc.y - 18} stroke="hsl(120, 25%, 25%)" strokeWidth="1" />
                    <rect x={loc.x - 1} y={loc.y - 22} width={6} height={4} fill="hsl(120, 30%, 35%)" />
                  </g>
                )}
                <text x={loc.x} y={loc.y + (loc.type === 'camp' ? 16 : 22)} textAnchor="middle" fontSize={9} fontWeight="bold" fill="hsl(var(--foreground))"
                  stroke="hsl(var(--background))" strokeWidth="2.5" paintOrder="stroke">
                  {loc.label[lang]}
                </text>
              </g>
            );
          })}

          {/* Compass rose */}
          <g transform={`translate(${width - 45}, ${height - 45})`} opacity="0.6">
            <circle cx={0} cy={0} r={18} fill="hsl(var(--background))" stroke="hsl(var(--foreground))" strokeWidth="1" opacity="0.8" />
            <polygon points="0,-15 3,-4 -3,-4" fill="hsl(0, 70%, 50%)" />
            <polygon points="0,15 3,4 -3,4" fill="hsl(var(--foreground))" opacity="0.4" />
            <polygon points="-15,0 -4,-3 -4,3" fill="hsl(var(--foreground))" opacity="0.3" />
            <polygon points="15,0 4,-3 4,3" fill="hsl(var(--foreground))" opacity="0.3" />
            <text x={0} y={-5} textAnchor="middle" fontSize={7} fontWeight="bold" fill="hsl(0, 70%, 50%)">N</text>
          </g>

          {/* Scale bar */}
          <g transform={`translate(20, ${height - 20})`} opacity="0.5">
            <line x1={0} y1={0} x2={60} y2={0} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
            <line x1={0} y1={-3} x2={0} y2={3} stroke="hsl(var(--foreground))" strokeWidth="1" />
            <line x1={60} y1={-3} x2={60} y2={3} stroke="hsl(var(--foreground))" strokeWidth="1" />
            <text x={30} y={-5} textAnchor="middle" fontSize={7} fill="hsl(var(--foreground))">1 km</text>
          </g>
        </svg>
      </div>

      {/* Info panel */}
      {(activeMove || activeLoc) && (
        <div className="p-4 border-t-2 border-foreground bg-muted/50">
          {activeMove && (
            <div>
              <p className="font-bold text-sm flex items-center gap-2">
                <span className="w-3 h-3 inline-block rounded-sm" style={{ backgroundColor: activeMove.color }} />
                {activeMove.label[lang]}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{activeMove.description[lang]}</p>
            </div>
          )}
          {activeLoc && (
            <div>
              <p className="font-bold text-sm">{activeLoc.label[lang]}</p>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="p-3 border-t border-border flex flex-wrap gap-4 text-xs">
        {movements.map(m => (
          <button
            key={m.id}
            onClick={() => setActiveMovement(activeMovement === m.id ? null : m.id)}
            className={`flex items-center gap-1.5 hover:opacity-80 transition-opacity ${activeMovement === m.id ? 'font-bold' : ''}`}
          >
            <span className="w-4 h-3 inline-block rounded-sm" style={{ backgroundColor: m.color }} />
            {m.label[lang]}
          </button>
        ))}
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <svg width="12" height="12"><circle cx="6" cy="6" r="4" fill="none" stroke="hsl(0,70%,50%)" strokeWidth="1.5" strokeDasharray="2 1" /></svg>
          {lang === 'es' ? 'Campo de batalla' : 'Battlefield'}
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <svg width="12" height="12"><polygon points="6,1 11,10 1,10" fill="hsl(120,30%,35%)" /></svg>
          {lang === 'es' ? 'Campamento' : 'Camp'}
        </span>
      </div>
    </div>
  );
};

export default BattleMap;
