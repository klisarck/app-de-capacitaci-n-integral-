import { useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, GitBranch, ChevronDown, ChevronRight } from 'lucide-react';
import type { SimulationNode, SimulationOption } from '@/data/simulations';

interface SimulationTreeBuilderProps {
  nodes: SimulationNode[];
  onChange: (nodes: SimulationNode[]) => void;
  startNodeId: string;
  onStartNodeChange: (id: string) => void;
}

const SimulationTreeBuilder = ({ nodes, onChange, startNodeId, onStartNodeChange }: SimulationTreeBuilderProps) => {
  const { lang } = useI18n();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['start']));

  const toggleExpand = (id: string) => {
    const next = new Set(expandedNodes);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedNodes(next);
  };

  const addNode = () => {
    const id = `node-${Date.now()}`;
    onChange([...nodes, {
      id,
      situation: { es: '', en: '' },
      options: [],
    }]);
    setExpandedNodes(new Set([...expandedNodes, id]));
  };

  const updateNode = (nodeId: string, field: string, value: any) => {
    onChange(nodes.map((n) => {
      if (n.id !== nodeId) return n;
      if (field === 'situation' || field === 'outcome') {
        return { ...n, [field]: { ...(n as any)[field], [lang]: value } };
      }
      if (field === 'isFinal') return { ...n, isFinal: value, options: value ? undefined : [] };
      return { ...n, [field]: value };
    }));
  };

  const addOption = (nodeId: string) => {
    onChange(nodes.map((n) => {
      if (n.id !== nodeId) return n;
      const opts = n.options || [];
      return {
        ...n,
        options: [...opts, {
          text: { es: '', en: '' },
          nextNodeId: '',
          scores: { tactical: 50, risk: 50, leadership: 50 },
        }],
      };
    }));
  };

  const updateOption = (nodeId: string, optIdx: number, field: string, value: any) => {
    onChange(nodes.map((n) => {
      if (n.id !== nodeId || !n.options) return n;
      const opts = [...n.options];
      if (field === 'text') {
        opts[optIdx] = { ...opts[optIdx], text: { ...opts[optIdx].text, [lang]: value } };
      } else if (field === 'nextNodeId') {
        opts[optIdx] = { ...opts[optIdx], nextNodeId: value };
      } else if (['tactical', 'risk', 'leadership'].includes(field)) {
        opts[optIdx] = { ...opts[optIdx], scores: { ...opts[optIdx].scores, [field]: Number(value) } };
      }
      return { ...n, options: opts };
    }));
  };

  const removeOption = (nodeId: string, optIdx: number) => {
    onChange(nodes.map((n) => {
      if (n.id !== nodeId || !n.options) return n;
      return { ...n, options: n.options.filter((_, i) => i !== optIdx) };
    }));
  };

  const removeNode = (nodeId: string) => {
    onChange(nodes.filter((n) => n.id !== nodeId));
  };

  const createSubNode = (parentNodeId: string, optIdx: number) => {
    const newId = `node-${Date.now()}`;
    const newNode: SimulationNode = { id: newId, situation: { es: '', en: '' }, options: [] };
    onChange(nodes.map((n) => {
      if (n.id !== parentNodeId || !n.options) return n;
      const opts = [...n.options];
      opts[optIdx] = { ...opts[optIdx], nextNodeId: newId };
      return { ...n, options: opts };
    }).concat(newNode));
    setExpandedNodes(new Set([...expandedNodes, newId]));
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          {lang === 'es' ? 'Árbol de Decisiones' : 'Decision Tree'}
          <span className="text-xs font-normal text-muted-foreground ml-auto">
            {nodes.length} {lang === 'es' ? 'nodos' : 'nodes'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {nodes.map((node) => {
          const isExpanded = expandedNodes.has(node.id);
          const isStart = node.id === startNodeId;
          return (
            <div key={node.id} className={`border-2 rounded-lg overflow-hidden ${isStart ? 'border-primary' : 'border-border'}`}>
              <button onClick={() => toggleExpand(node.id)}
                className="w-full flex items-center gap-2 px-3 py-2 bg-muted/50 hover:bg-muted text-left">
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <span className="text-xs font-mono text-muted-foreground">{node.id}</span>
                {isStart && <span className="text-[10px] bg-primary text-primary-foreground px-1.5 rounded font-bold">START</span>}
                {node.isFinal && <span className="text-[10px] bg-destructive text-destructive-foreground px-1.5 rounded font-bold">FINAL</span>}
                <span className="text-sm font-medium truncate flex-1">
                  {node.situation[lang]?.slice(0, 60) || (lang === 'es' ? '(sin situación)' : '(no situation)')}
                </span>
              </button>

              {isExpanded && (
                <div className="p-3 space-y-3">
                  <div className="flex gap-2">
                    <Input value={node.id} onChange={(e) => {
                      const oldId = node.id;
                      const newId = e.target.value;
                      onChange(nodes.map((n) => {
                        let updated = n.id === oldId ? { ...n, id: newId } : n;
                        if (updated.options) {
                          updated = { ...updated, options: updated.options.map((o) => o.nextNodeId === oldId ? { ...o, nextNodeId: newId } : o) };
                        }
                        return updated;
                      }));
                      if (startNodeId === oldId) onStartNodeChange(newId);
                    }} placeholder="ID" className="text-xs font-mono w-32" />
                    <Button size="sm" variant={isStart ? 'default' : 'outline'} onClick={() => onStartNodeChange(node.id)} className="text-xs">
                      {lang === 'es' ? 'Inicio' : 'Start'}
                    </Button>
                    <label className="flex items-center gap-1 text-xs">
                      <input type="checkbox" checked={!!node.isFinal} onChange={(e) => updateNode(node.id, 'isFinal', e.target.checked)} />
                      Final
                    </label>
                    <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto" onClick={() => removeNode(node.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>

                  <Textarea
                    placeholder={`${lang === 'es' ? 'Situación' : 'Situation'} (${lang.toUpperCase()})`}
                    value={node.situation[lang]}
                    onChange={(e) => updateNode(node.id, 'situation', e.target.value)}
                    rows={3} className="text-sm"
                  />

                  {node.isFinal && (
                    <Textarea
                      placeholder={`${lang === 'es' ? 'Resultado final' : 'Final outcome'} (${lang.toUpperCase()})`}
                      value={node.outcome?.[lang] || ''}
                      onChange={(e) => updateNode(node.id, 'outcome', e.target.value)}
                      rows={2} className="text-sm"
                    />
                  )}

                  {!node.isFinal && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-muted-foreground uppercase">
                        {lang === 'es' ? 'Opciones' : 'Options'} ({node.options?.length || 0})
                      </div>
                      {node.options?.map((opt, oi) => (
                        <div key={oi} className="border border-border rounded p-2 space-y-2 bg-background">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">{String.fromCharCode(65 + oi)}</span>
                            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => removeOption(node.id, oi)}>
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                          <Textarea
                            placeholder={`${lang === 'es' ? 'Texto de opción' : 'Option text'} (${lang.toUpperCase()})`}
                            value={opt.text[lang]}
                            onChange={(e) => updateOption(node.id, oi, 'text', e.target.value)}
                            rows={2} className="text-xs"
                          />
                          <div className="grid grid-cols-3 gap-1">
                            <div>
                              <label className="text-[10px] text-muted-foreground">Tactical</label>
                              <Input type="number" min={0} max={100} value={opt.scores.tactical}
                                onChange={(e) => updateOption(node.id, oi, 'tactical', e.target.value)} className="text-xs h-7" />
                            </div>
                            <div>
                              <label className="text-[10px] text-muted-foreground">Risk</label>
                              <Input type="number" min={0} max={100} value={opt.scores.risk}
                                onChange={(e) => updateOption(node.id, oi, 'risk', e.target.value)} className="text-xs h-7" />
                            </div>
                            <div>
                              <label className="text-[10px] text-muted-foreground">Leadership</label>
                              <Input type="number" min={0} max={100} value={opt.scores.leadership}
                                onChange={(e) => updateOption(node.id, oi, 'leadership', e.target.value)} className="text-xs h-7" />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <select value={opt.nextNodeId} onChange={(e) => updateOption(node.id, oi, 'nextNodeId', e.target.value)}
                              className="flex-1 rounded-md border border-input bg-background px-2 py-1 text-xs">
                              <option value="">{lang === 'es' ? '-- Nodo siguiente --' : '-- Next node --'}</option>
                              {nodes.filter((n) => n.id !== node.id).map((n) => (
                                <option key={n.id} value={n.id}>{n.id}</option>
                              ))}
                            </select>
                            <Button size="sm" variant="outline" className="text-[10px] h-7" onClick={() => createSubNode(node.id, oi)}>
                              <Plus className="h-3 w-3 mr-0.5" /> {lang === 'es' ? 'Sub-nodo' : 'Sub-node'}
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button onClick={() => addOption(node.id)} variant="outline" size="sm" className="w-full border-dashed text-xs">
                        <Plus className="h-3 w-3 mr-1" /> {lang === 'es' ? 'Agregar Opción' : 'Add Option'}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        <Button onClick={addNode} className="w-full">
          <Plus className="h-4 w-4 mr-1" /> {lang === 'es' ? 'Agregar Nodo' : 'Add Node'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SimulationTreeBuilder;
