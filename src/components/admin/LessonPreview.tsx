import { useI18n } from '@/contexts/I18nContext';
import InteractiveTimeline from '@/components/InteractiveTimeline';
import BattleMap from '@/components/BattleMap';
import VideoEmbed from '@/components/VideoEmbed';
import MiniQuiz from '@/components/MiniQuiz';
import type { InteractiveElement } from '@/data/courses';

interface LessonPreviewProps {
  content: { es: string; en: string };
  interactiveElements: InteractiveElement[];
}

const LessonPreview = ({ content, interactiveElements }: LessonPreviewProps) => {
  const { lang } = useI18n();

  return (
    <div className="border-2 border-border rounded-lg p-4 bg-card space-y-6">
      <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
        {lang === 'es' ? '👁️ Vista Previa' : '👁️ Preview'}
      </div>

      {content[lang] && (
        <div className="prose prose-sm max-w-none">
          {content[lang].split('\n').map((p, i) => (
            <p key={i} className="text-sm text-foreground">{p}</p>
          ))}
        </div>
      )}

      {interactiveElements.map((el, i) => (
        <div key={i}>
          {el.type === 'video' && el.videoId && (
            <VideoEmbed videoId={el.videoId} title={(el.videoTitle || { es: '', en: '' })[lang]} />
          )}
          {el.type === 'timeline' && el.timelineData && el.timelineData.length > 0 && (
            <InteractiveTimeline events={el.timelineData} title={el.timelineTitle || { es: 'Línea de Tiempo', en: 'Timeline' }} />
          )}
          {el.type === 'battlemap' && el.battleMapData && (
            <BattleMap
              title={el.battleMapData.title}
              movements={el.battleMapData.movements}
              locations={el.battleMapData.locations}
            />
          )}
        </div>
      ))}

      {!content[lang] && interactiveElements.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          {lang === 'es' ? 'Agregue contenido y elementos interactivos para ver la vista previa' : 'Add content and interactive elements to see the preview'}
        </div>
      )}
    </div>
  );
};

export default LessonPreview;
