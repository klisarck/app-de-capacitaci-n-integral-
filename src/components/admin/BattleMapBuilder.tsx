import { useState, useRef, useCallback } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, MapPin, ArrowRight, MousePointer, Undo2 } from 'lucide-react';

export interface Waypoint {
  x: number;
  y: number;
}

export interface Movement {
  id: string;
  label: { es: string; en: string };
  description: { es: string; en: string };
  path: string;
  color: string;
  startX: number; startY: number;
  endX: number; endY: number;
  waypoints?: Waypoint[];
}

// Ensure waypoints exist on a movement
const ensureWaypoints = (m: Movement): Movement & { waypoints: Waypoint[] } => ({
  ...m,
  waypoints: m.waypoints || [],
});

export interface Location {
  id: string;
  label: { es: string; en: string };
  x: number; y: number;
  type: 'city' | 'battlefield' | 'camp';
}

interface BattleMapBuilderProps {
  title: { es: string; en: string };
  onTitleChange: (t: { es: string; en: string }) => void;
  movements: Movement[];
  onMovementsChange: (m: Movement[]) => void;
  locations: Location[];
  onLocationsChange: (l: Location[]) => void;
}

const COLORS = ['#dc2626', '#2563eb', '#16a34a', '#ca8a04', '#9333ea', '#0891b2'];
const CANVAS_W = 600;
const CANVAS_H = 400;

type CanvasMode = 'select' | 'place-location' | 'add-waypoint';

/** Generate an SVG path string from waypoints */
const waypointsToPath = (wps: Waypoint[]): string => {
  if (wps.length < 2) return '';
  const [first, ...rest] = wps;
  // Use smooth curves through waypoints for a natural look
  if (rest.length === 1) {
    return `M ${first.x} ${first.y} L ${rest[0].x} ${rest[0].y}`;
  }
  let d = `M ${first.x} ${first.y}`;
  for (let i = 0; i < rest.length; i++) {
    const prev = i === 0 ? first : rest[i - 1];
    const curr = rest[i];
    const cpx = (prev.x + curr.x) / 2;
    const cpy = (prev.y + curr.y) / 2;
    d += ` Q ${prev.x + (curr.x - prev.x) * 0.5} ${prev.y} ${cpx} ${cpy}`;
  }
  // End at last point
  const last = rest[rest.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
};

const BattleMapBuilder = ({ title, onTitleChange, movements, onMovementsChange, locations, onLocationsChange }: BattleMapBuilderProps) => {
  const { lang } = useI18n();
  const svgRef = useRef<SVGSVGElement>(null);
  const [mode, setMode] = useState<CanvasMode>('select');
  const [activeTab, setActiveTab] = useState<'locations' | 'movements'>('locations');
  const [selectedMovementIdx, setSelectedMovementIdx] = useState<number | null>(null);
  const [dragging, setDragging] = useState<{ type: 'location' | 'waypoint'; idx: number; wpIdx?: number } | null>(null);
  const [newLocationType, setNewLocationType] = useState<'city' | 'battlefield' | 'camp'>('city');

  const getSvgCoords = useCallback((e: React.MouseEvent): { x: number; y: number } | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * CANVAS_W;
    const y = ((e.clientY - rect.top) / rect.height) * CANVAS_H;
    return { x: Math.round(x), y: Math.round(y) };
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    const coords = getSvgCoords(e);
    if (!coords) return;

    if (mode === 'place-location') {
      const newLoc: Location = {
        id: `loc-${Date.now()}`,
        label: { es: '', en: '' },
        x: coords.x, y: coords.y,
        type: newLocationType,
      };
      onLocationsChange([...locations, newLoc]);
    } else if (mode === 'add-waypoint' && selectedMovementIdx !== null) {
      const updated = [...movements];
      const mov = { ...updated[selectedMovementIdx] };
      const wps = [...(mov.waypoints || []), coords];
      mov.waypoints = wps;
      mov.path = waypointsToPath(wps);
      if (wps.length >= 1) {
        mov.startX = wps[0].x;
        mov.startY = wps[0].y;
      }
      if (wps.length >= 2) {
        mov.endX = wps[wps.length - 1].x;
        mov.endY = wps[wps.length - 1].y;
      }
      updated[selectedMovementIdx] = mov;
      onMovementsChange(updated);
    }
  }, [mode, newLocationType, locations, movements, selectedMovementIdx, getSvgCoords, onLocationsChange, onMovementsChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent, type: 'location' | 'waypoint', idx: number, wpIdx?: number) => {
    e.stopPropagation();
    if (mode !== 'select') return;
    setDragging({ type, idx, wpIdx });
  }, [mode]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    const coords = getSvgCoords(e);
    if (!coords) return;

    if (dragging.type === 'location') {
      const updated = [...locations];
      updated[dragging.idx] = { ...updated[dragging.idx], x: coords.x, y: coords.y };
      onLocationsChange(updated);
    } else if (dragging.type === 'waypoint' && dragging.wpIdx !== undefined) {
      const updated = [...movements];
      const mov = { ...updated[dragging.idx] };
      const wps = [...(mov.waypoints || [])];
      wps[dragging.wpIdx] = coords;
      mov.waypoints = wps;
      mov.path = waypointsToPath(wps);
      mov.startX = wps[0].x;
      mov.startY = wps[0].y;
      mov.endX = wps[wps.length - 1].x;
      mov.endY = wps[wps.length - 1].y;
      updated[dragging.idx] = mov;
      onMovementsChange(updated);
    }
  }, [dragging, getSvgCoords, locations, movements, onLocationsChange, onMovementsChange]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  const addMovement = () => {
    const newMov: Movement = {
      id: `mov-${Date.now()}`,
      label: { es: '', en: '' },
      description: { es: '', en: '' },
      path: '',
      color: COLORS[movements.length % COLORS.length],
      startX: 0, startY: 0, endX: 0, endY: 0,
      waypoints: [],
    };
    onMovementsChange([...movements, newMov]);
    setSelectedMovementIdx(movements.length);
    setMode('add-waypoint');
    setActiveTab('movements');
  };

  const removeLastWaypoint = (movIdx: number) => {
    const updated = [...movements];
    const mov = { ...updated[movIdx] };
    const wps = (mov.waypoints || []).slice(0, -1);
    mov.waypoints = wps;
    mov.path = waypointsToPath(wps);
    if (wps.length >= 1) { mov.startX = wps[0].x; mov.startY = wps[0].y; }
    if (wps.length >= 2) { mov.endX = wps[wps.length - 1].x; mov.endY = wps[wps.length - 1].y; }
    updated[movIdx] = mov;
    onMovementsChange(updated);
  };

  const updateMovementText = (i: number, field: 'label' | 'description', value: string) => {
    const updated = [...movements];
    updated[i] = { ...updated[i], [field]: { ...updated[i][field], [lang]: value } };
    onMovementsChange(updated);
  };

  const updateMovementColor = (i: number, color: string) => {
    const updated = [...movements];
    updated[i] = { ...updated[i], color };
    onMovementsChange(updated);
  };

  const updateLocationLabel = (i: number, value: string) => {
    const updated = [...locations];
    updated[i] = { ...updated[i], label: { ...updated[i].label, [lang]: value } };
    onLocationsChange(updated);
  };

  const updateLocationType = (i: number, type: 'city' | 'battlefield' | 'camp') => {
    const updated = [...locations];
    updated[i] = { ...updated[i], type };
    onLocationsChange(updated);
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold">
          {lang === 'es' ? '🗺️ Constructor de Mapa de Batalla' : '🗺️ Battle Map Builder'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Título (ES)" value={title.es} onChange={(e) => onTitleChange({ ...title, es: e.target.value })} />
          <Input placeholder="Title (EN)" value={title.en} onChange={(e) => onTitleChange({ ...title, en: e.target.value })} />
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 items-center p-2 bg-muted/50 rounded-lg border">
          <Button size="sm" variant={mode === 'select' ? 'default' : 'outline'} onClick={() => { setMode('select'); setSelectedMovementIdx(null); }}>
            <MousePointer className="h-3.5 w-3.5 mr-1" />
            {lang === 'es' ? 'Seleccionar / Arrastrar' : 'Select / Drag'}
          </Button>
          <Button size="sm" variant={mode === 'place-location' ? 'default' : 'outline'} onClick={() => { setMode('place-location'); setSelectedMovementIdx(null); }}>
            <MapPin className="h-3.5 w-3.5 mr-1" />
            {lang === 'es' ? 'Colocar Ubicación' : 'Place Location'}
          </Button>
          {mode === 'place-location' && (
            <select value={newLocationType} onChange={(e) => setNewLocationType(e.target.value as any)}
              className="rounded-md border border-input bg-background px-2 py-1 text-xs">
              <option value="city">{lang === 'es' ? 'Ciudad' : 'City'}</option>
              <option value="battlefield">{lang === 'es' ? 'Batalla' : 'Battle'}</option>
              <option value="camp">{lang === 'es' ? 'Campamento' : 'Camp'}</option>
            </select>
          )}
          <Button size="sm" variant="outline" onClick={addMovement}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            {lang === 'es' ? 'Nuevo Movimiento' : 'New Movement'}
          </Button>
          {mode === 'add-waypoint' && selectedMovementIdx !== null && (
            <span className="text-xs text-primary font-semibold animate-pulse">
              {lang === 'es'
                ? `✏️ Haz clic en el mapa para agregar puntos al movimiento #${selectedMovementIdx + 1}`
                : `✏️ Click on the map to add waypoints to movement #${selectedMovementIdx + 1}`}
            </span>
          )}
        </div>

        {/* Interactive Canvas */}
        <div
          className="relative w-full bg-muted rounded-lg border-2 border-border overflow-hidden"
          style={{ cursor: mode === 'select' ? (dragging ? 'grabbing' : 'default') : 'crosshair' }}
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
            className="w-full"
            style={{ minHeight: 320 }}
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Grid */}
            <defs>
              <pattern id="builder-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.5" />
              </pattern>
              <pattern id="builder-grid-sm" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="hsl(var(--border))" strokeWidth="0.2" opacity="0.3" />
              </pattern>
            </defs>
            <rect width={CANVAS_W} height={CANVAS_H} fill="hsl(var(--muted))" />
            <rect width={CANVAS_W} height={CANVAS_H} fill="url(#builder-grid-sm)" />
            <rect width={CANVAS_W} height={CANVAS_H} fill="url(#builder-grid)" />

            {/* Axis labels */}
            {Array.from({ length: 13 }).map((_, i) => (
              <text key={`xl-${i}`} x={i * 50} y={12} fontSize="8" fill="hsl(var(--muted-foreground))" textAnchor="middle" opacity="0.6">{i * 50}</text>
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
              <text key={`yl-${i}`} x={8} y={i * 50 + 4} fontSize="8" fill="hsl(var(--muted-foreground))" opacity="0.6">{i * 50}</text>
            ))}

            {/* Movement paths */}
            {movements.map((m, mi) => {
              const isSelected = selectedMovementIdx === mi;
              const wps = m.waypoints || [];
              if (wps.length < 2) {
                return wps.map((wp, wi) => (
                  <circle key={`${mi}-wp-${wi}`} cx={wp.x} cy={wp.y} r={6} fill={m.color} stroke="white" strokeWidth="2"
                    className="cursor-grab" onMouseDown={(e) => handleMouseDown(e, 'waypoint', mi, wi)} />
                ));
              }
              return (
                <g key={`mov-${mi}`}>
                  {/* Path shadow */}
                  <path d={m.path} stroke="rgba(0,0,0,0.15)" strokeWidth={isSelected ? 7 : 5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Main path */}
                  <path d={m.path} stroke={m.color} strokeWidth={isSelected ? 5 : 3} fill="none"
                    strokeLinecap="round" strokeLinejoin="round" strokeDasharray={isSelected ? 'none' : '8 4'}
                    onClick={(e) => { e.stopPropagation(); setSelectedMovementIdx(mi); setMode('add-waypoint'); setActiveTab('movements'); }}
                    className="cursor-pointer" />
                  {/* Waypoint handles */}
                  {wps.map((wp, wi) => (
                    <g key={`${mi}-wp-${wi}`}>
                      <circle cx={wp.x} cy={wp.y} r={isSelected ? 6 : 4}
                        fill={wi === 0 ? m.color : wi === wps.length - 1 ? 'white' : `${m.color}88`}
                        stroke={wi === wps.length - 1 ? m.color : 'white'} strokeWidth={isSelected ? 2 : 1}
                        className="cursor-grab"
                        onMouseDown={(e) => handleMouseDown(e, 'waypoint', mi, wi)} />
                      {isSelected && (
                        <text x={wp.x} y={wp.y - 8} textAnchor="middle" fontSize="7" fill={m.color} fontWeight="bold">{wi + 1}</text>
                      )}
                    </g>
                  ))}
                  {/* Arrow at end */}
                  {wps.length >= 2 && (() => {
                    const last = wps[wps.length - 1];
                    const prev = wps[wps.length - 2];
                    const angle = Math.atan2(last.y - prev.y, last.x - prev.x);
                    const size = 10;
                    return (
                      <polygon
                        points={`${last.x},${last.y} ${last.x - size * Math.cos(angle - 0.4)},${last.y - size * Math.sin(angle - 0.4)} ${last.x - size * Math.cos(angle + 0.4)},${last.y - size * Math.sin(angle + 0.4)}`}
                        fill={m.color}
                      />
                    );
                  })()}
                </g>
              );
            })}

            {/* Locations */}
            {locations.map((loc, i) => (
              <g key={`loc-${i}`} className="cursor-grab" onMouseDown={(e) => handleMouseDown(e, 'location', i)}>
                {loc.type === 'city' && (
                  <>
                    <rect x={loc.x - 8} y={loc.y - 8} width={16} height={12} rx={1} fill="hsl(30, 40%, 55%)" stroke="hsl(var(--foreground))" strokeWidth="1" />
                    <polygon points={`${loc.x - 9},${loc.y - 8} ${loc.x},${loc.y - 16} ${loc.x + 9},${loc.y - 8}`} fill="hsl(0, 50%, 50%)" />
                  </>
                )}
                {loc.type === 'battlefield' && (
                  <>
                    <circle cx={loc.x} cy={loc.y} r={10} fill="none" stroke="hsl(0, 70%, 50%)" strokeWidth="2" strokeDasharray="3 2" />
                    <line x1={loc.x - 5} y1={loc.y - 5} x2={loc.x + 5} y2={loc.y + 5} stroke="hsl(0, 70%, 50%)" strokeWidth="2" />
                    <line x1={loc.x + 5} y1={loc.y - 5} x2={loc.x - 5} y2={loc.y + 5} stroke="hsl(0, 70%, 50%)" strokeWidth="2" />
                  </>
                )}
                {loc.type === 'camp' && (
                  <polygon points={`${loc.x},${loc.y - 12} ${loc.x + 10},${loc.y + 4} ${loc.x - 10},${loc.y + 4}`}
                    fill="hsl(120, 30%, 40%)" stroke="hsl(var(--foreground))" strokeWidth="1" />
                )}
                <text x={loc.x} y={loc.y + 18} textAnchor="middle" fontSize="10" fontWeight="bold" fill="hsl(var(--foreground))"
                  stroke="hsl(var(--background))" strokeWidth="2.5" paintOrder="stroke">
                  {loc.label[lang] || `#${i + 1}`}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <Button size="sm" variant={activeTab === 'locations' ? 'default' : 'outline'} onClick={() => setActiveTab('locations')}>
            <MapPin className="h-3.5 w-3.5 mr-1" />
            {lang === 'es' ? 'Ubicaciones' : 'Locations'} ({locations.length})
          </Button>
          <Button size="sm" variant={activeTab === 'movements' ? 'default' : 'outline'} onClick={() => setActiveTab('movements')}>
            <ArrowRight className="h-3.5 w-3.5 mr-1" />
            {lang === 'es' ? 'Movimientos' : 'Movements'} ({movements.length})
          </Button>
        </div>

        {activeTab === 'locations' && (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {locations.map((loc, i) => (
              <div key={i} className="border rounded-lg p-2 space-y-2 bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">
                    #{i + 1} — ({loc.x}, {loc.y})
                  </span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onLocationsChange(locations.filter((_, j) => j !== i))}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder={lang === 'es' ? 'Nombre (ES)' : 'Name (EN)'} value={loc.label[lang]}
                    onChange={(e) => updateLocationLabel(i, e.target.value)} className="text-sm" />
                  <select value={loc.type} onChange={(e) => updateLocationType(i, e.target.value as any)}
                    className="rounded-md border border-input bg-background px-2 text-sm">
                    <option value="city">{lang === 'es' ? 'Ciudad' : 'City'}</option>
                    <option value="battlefield">{lang === 'es' ? 'Batalla' : 'Battle'}</option>
                    <option value="camp">{lang === 'es' ? 'Campamento' : 'Camp'}</option>
                  </select>
                </div>
              </div>
            ))}
            {locations.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">
                {lang === 'es' ? 'Usa el botón "Colocar Ubicación" y haz clic en el mapa' : 'Use "Place Location" and click on the map'}
              </p>
            )}
          </div>
        )}

        {activeTab === 'movements' && (
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {movements.map((m, i) => {
              const isSelected = selectedMovementIdx === i;
              return (
                <div key={i} className={`border rounded-lg p-2 space-y-2 ${isSelected ? 'bg-primary/10 border-primary' : 'bg-muted/30'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: m.color }} />
                      <span className="text-xs font-bold text-muted-foreground">
                        #{i + 1} — {(m.waypoints || []).length} {lang === 'es' ? 'puntos' : 'points'}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6" title={lang === 'es' ? 'Agregar puntos' : 'Add waypoints'}
                        onClick={() => { setSelectedMovementIdx(i); setMode('add-waypoint'); }}>
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" title={lang === 'es' ? 'Quitar último punto' : 'Remove last point'}
                        onClick={() => removeLastWaypoint(i)} disabled={(m.waypoints || []).length === 0}>
                        <Undo2 className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onMovementsChange(movements.filter((_, j) => j !== i))}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <Input placeholder={`${lang === 'es' ? 'Etiqueta' : 'Label'} (${lang.toUpperCase()})`} value={m.label[lang]}
                    onChange={(e) => updateMovementText(i, 'label', e.target.value)} className="text-sm" />
                  <Input placeholder={`${lang === 'es' ? 'Descripción' : 'Description'} (${lang.toUpperCase()})`} value={m.description[lang]}
                    onChange={(e) => updateMovementText(i, 'description', e.target.value)} className="text-sm" />
                  <div className="flex gap-1">
                    {COLORS.map((c) => (
                      <button key={c} onClick={() => updateMovementColor(i, c)}
                        className={`w-5 h-5 rounded-full border-2 transition-transform ${m.color === c ? 'border-foreground scale-125' : 'border-transparent'}`}
                        style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
              );
            })}
            {movements.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">
                {lang === 'es' ? 'Crea un movimiento y haz clic en el mapa para trazar la ruta' : 'Create a movement and click the map to trace the route'}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BattleMapBuilder;
