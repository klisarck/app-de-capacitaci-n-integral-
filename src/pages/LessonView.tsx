import { useI18n } from '@/contexts/I18nContext';
import AppLayout from '@/components/AppLayout';
import { sampleCourses } from '@/data/courses';
import { lessonQuizzes } from '@/data/quizzes';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DrillFigureGallery from '@/components/DrillFigureGallery';
import VideoEmbed from '@/components/VideoEmbed';
import InteractiveTimeline from '@/components/InteractiveTimeline';
import BattleMap from '@/components/BattleMap';

const LessonView = () => {
  const { t, lang } = useI18n();
  const { courseId, moduleId, lessonId } = useParams();

  const course = sampleCourses.find((c) => c.id === courseId);
  const module = course?.modules.find((m) => m.id === moduleId);
  const lesson = module?.lessons.find((l) => l.id === lessonId);
  const hasQuiz = lessonId ? (lessonQuizzes[lessonId]?.length ?? 0) > 0 : false;

  if (!course || !module || !lesson) {
    return (
      <AppLayout isLoggedIn>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">{t.common.error}</p>
        </div>
      </AppLayout>
    );
  }

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-black mb-4 mt-8 first:mt-0">{line.slice(2)}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mb-3 mt-6">{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mb-2 mt-4">{line.slice(4)}</h3>;
      if (line.startsWith('- ')) return <li key={i} className="ml-6 list-disc text-sm leading-relaxed">{renderBold(line.slice(2))}</li>;
      if (line.startsWith('| ')) return null;
      if (line.trim() === '') return <div key={i} className="h-2" />;
      return <p key={i} className="text-sm leading-relaxed mb-2">{renderBold(line)}</p>;
    });
  };

  const renderBold = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i} className="font-bold">{part}</strong> : part
    );
  };

  const allLessons = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ moduleId: m.id, lesson: l }))
  );
  const currentIndex = allLessons.findIndex((l) => l.lesson.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <AppLayout isLoggedIn>
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Link
            to={`/courses/${courseId}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.lesson.backToCourse}
          </Link>

          <div className="border-b-2 border-foreground pb-4 mb-8">
            <p className="text-military-label mb-1">{module.title[lang]}</p>
            <h1 className="text-2xl md:text-3xl font-black">{lesson.title[lang]}</h1>
          </div>

          <article className="mb-12">
            {renderContent(lesson.content[lang])}
          </article>

          {/* Interactive elements */}
          {lesson.interactiveElements && lesson.interactiveElements.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                <span className="w-3 h-3 bg-military-green inline-block" />
                {lang === 'es' ? 'Material Interactivo' : 'Interactive Material'}
              </h2>
              {lesson.interactiveElements.map((el, i) => {
                if (el.type === 'video' && el.videoId) {
                  return (
                    <VideoEmbed
                      key={i}
                      videoId={el.videoId}
                      title={el.videoTitle?.[lang] || ''}
                    />
                  );
                }
                if (el.type === 'timeline' && el.timelineData && el.timelineTitle) {
                  return (
                    <InteractiveTimeline
                      key={i}
                      events={el.timelineData}
                      title={el.timelineTitle}
                    />
                  );
                }
                if (el.type === 'battlemap' && el.battleMapData) {
                  return (
                    <BattleMap
                      key={i}
                      title={el.battleMapData.title}
                      movements={el.battleMapData.movements}
                      locations={el.battleMapData.locations}
                    />
                  );
                }
                return null;
              })}
            </section>
          )}

          {/* Interactive drill gallery + voice command recorder for Orden Cerrado lessons */}
          {courseId === 'orden-cerrado' && <DrillFigureGallery />}

          {/* Quiz CTA */}
          {hasQuiz && (
            <div className="border-2 border-military-green bg-military-green/5 p-6 mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <ClipboardCheck className="h-6 w-6 text-military-green" />
                  <div>
                    <p className="font-bold text-sm">{t.lesson.quizTitle}</p>
                    <p className="text-xs text-muted-foreground">{t.lesson.quizSubtitle}</p>
                  </div>
                </div>
                <Link to={`/courses/${courseId}/${moduleId}/${lessonId}/quiz`}>
                  <Button className="rounded-none font-bold uppercase tracking-widest text-xs bg-military-green hover:bg-military-green/90 text-white">
                    {t.lesson.quiz}
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="border-t-2 border-foreground pt-6 flex justify-between">
            {prevLesson ? (
              <Link
                to={`/courses/${courseId}/${prevLesson.moduleId}/${prevLesson.lesson.id}`}
                className="text-sm font-semibold underline underline-offset-4"
              >
                ← {t.lesson.previousLesson}
              </Link>
            ) : <div />}
            {nextLesson ? (
              <Link
                to={`/courses/${courseId}/${nextLesson.moduleId}/${nextLesson.lesson.id}`}
                className="text-sm font-semibold underline underline-offset-4"
              >
                {t.lesson.nextLesson} →
              </Link>
            ) : <div />}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default LessonView;
