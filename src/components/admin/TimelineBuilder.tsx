import { useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, GripVertical, Swords, Mountain, Flag, MapPin, Star, Shield, Footprints } from 'lucide-react';
import type { TimelineEvent } from '@/components/InteractiveTimeline';

const ICON_OPTIONS = [
  { value: '⚔️', label: 'Batalla', icon: <Swords className="h-4 w-4" /> },
  { value: '🏔️', label: 'Montaña', icon: <Mountain className="h-4 w-4" /> },
  { value: '🚩', label: 'Bandera', icon: <Flag className="h-4 w-4" /> },
  { value: '📍', label: 'Ubicación', icon: <MapPin className="h-4 w-4" /> },
  { value: '⭐', label: 'Estrella', icon: <Star className="h-4 w-4" /> },
  { value: '🛡️', label: 'Escudo', icon: <Shield className="h-4 w-4" /> },
  { value: '🥾', label: 'Marcha', icon: <Footprints className="h-4 w-4" /> },
];

interface TimelineBuilderProps {
  events: TimelineEvent[];
  onChange: (events: TimelineEvent[]) => void;
  title: { es: string; en: string };
  onTitleChange: (title: { es: string; en: string }) => void;
}

const TimelineBuilder = ({ events, onChange, title, onTitleChange }: TimelineBuilderProps) => {
  const { lang, t } = useI18n();

  const addEvent = () => {
    onChange([...events, { year: '', title: { es: '', en: '' }, description: { es: '', en: '' }, icon: '⚔️' }]);
  };

  const updateEvent = (index: number, field: string, value: any) => {
    const updated = [...events];
    if (field === 'year' || field === 'icon') {
      (updated[index] as any)[field] = value;
    } else {
      (updated[index] as any)[field] = { ...(updated[index] as any)[field], [lang]: value };
    }
    onChange(updated);
  };

  const removeEvent = (index: number) => {
    onChange(events.filter((_, i) => i !== index));
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold">
          {lang === 'es' ? '🕐 Constructor de Línea de Tiempo' : '🕐 Timeline Builder'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder={lang === 'es' ? 'Título (ES)' : 'Title (ES)'}
            value={title.es}
            onChange={(e) => onTitleChange({ ...title, es: e.target.value })}
          />
          <Input
            placeholder={lang === 'es' ? 'Título (EN)' : 'Title (EN)'}
            value={title.en}
            onChange={(e) => onTitleChange({ ...title, en: e.target.value })}
          />
        </div>

        {events.map((event, i) => (
          <div key={i} className="border-2 border-border rounded-lg p-3 space-y-2 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-bold text-muted-foreground">
                  {lang === 'es' ? 'Evento' : 'Event'} #{i + 1}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeEvent(i)} className="h-7 w-7">
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>

            <Input
              placeholder={lang === 'es' ? 'Año / Fecha' : 'Year / Date'}
              value={event.year}
              onChange={(e) => updateEvent(i, 'year', e.target.value)}
              className="text-sm"
            />

            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder={`${lang === 'es' ? 'Título' : 'Title'} (${lang.toUpperCase()})`}
                value={event.title[lang]}
                onChange={(e) => updateEvent(i, 'title', e.target.value)}
                className="text-sm"
              />
              <div className="flex gap-1 flex-wrap">
                {ICON_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateEvent(i, 'icon', opt.value)}
                    className={`p-1 rounded border ${event.icon === opt.value ? 'border-primary bg-primary/10' : 'border-transparent'}`}
                    title={opt.label}
                  >
                    {opt.icon}
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              placeholder={`${lang === 'es' ? 'Descripción' : 'Description'} (${lang.toUpperCase()})`}
              value={event.description[lang]}
              onChange={(e) => updateEvent(i, 'description', e.target.value)}
              rows={2}
              className="text-sm"
            />
          </div>
        ))}

        <Button onClick={addEvent} variant="outline" className="w-full border-dashed border-2">
          <Plus className="h-4 w-4 mr-1" />
          {lang === 'es' ? 'Agregar Evento' : 'Add Event'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TimelineBuilder;
