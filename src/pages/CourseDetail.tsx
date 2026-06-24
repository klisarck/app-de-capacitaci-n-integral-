import { useI18n } from '@/contexts/I18nContext';
import AppLayout from '@/components/AppLayout';
import { sampleCourses } from '@/data/courses';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CourseDetail = () => {
  const { t, lang } = useI18n();
  const { courseId } = useParams();
  const course = sampleCourses.find((c) => c.id === courseId);

  if (!course) {
    return (
      <AppLayout isLoggedIn>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">{t.common.error}</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout isLoggedIn>
      <div className="container mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Link to="/courses" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            {t.courses.title}
          </Link>

          <div className="border-b-2 border-foreground pb-8 mb-8">
            <h1 className="text-3xl md:text-4xl font-black mb-3">{course.title[lang]}</h1>
            <p className="text-muted-foreground max-w-2xl">{course.description[lang]}</p>
          </div>

          <div className="space-y-8">
            {course.modules.map((mod, mi) => (
              <div key={mod.id}>
                <h2 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">
                  {lang === 'es' ? 'Módulo' : 'Module'} {mi + 1} — {mod.title[lang]}
                </h2>
                <div className="space-y-3">
                  {mod.lessons.map((lesson, li) => (
                    <Link
                      key={lesson.id}
                      to={`/courses/${courseId}/${mod.id}/${lesson.id}`}
                      className="block border-2 border-foreground p-5 hover:bg-accent transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-muted-foreground text-sm">
                            {mi + 1}.{li + 1}
                          </span>
                          <span className="font-semibold group-hover:underline underline-offset-4">
                            {lesson.title[lang]}
                          </span>
                          <span className="text-military-label border border-muted-foreground px-2 py-0.5">
                            {lesson.type.toUpperCase()}
                          </span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default CourseDetail;
