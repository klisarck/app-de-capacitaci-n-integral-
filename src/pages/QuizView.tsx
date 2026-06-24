import { useI18n } from '@/contexts/I18nContext';
import AppLayout from '@/components/AppLayout';
import { sampleCourses } from '@/data/courses';
import { lessonQuizzes } from '@/data/quizzes';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import MiniQuiz from '@/components/MiniQuiz';

const QuizView = () => {
  const { t, lang } = useI18n();
  const { courseId, moduleId, lessonId } = useParams();

  const course = sampleCourses.find((c) => c.id === courseId);
  const module = course?.modules.find((m) => m.id === moduleId);
  const lesson = module?.lessons.find((l) => l.id === lessonId);
  const quiz = lessonId ? lessonQuizzes[lessonId] : undefined;

  if (!course || !module || !lesson || !quiz || quiz.length === 0) {
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
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Link
            to={`/courses/${courseId}/${moduleId}/${lessonId}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.lesson.backToCourse}
          </Link>

          <div className="border-b-2 border-military-green pb-4 mb-8">
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="h-5 w-5 text-military-green" />
              <p className="text-military-label text-military-green">{t.lesson.quiz}</p>
            </div>
            <h1 className="text-2xl md:text-3xl font-black">{lesson.title[lang]}</h1>
            <p className="text-sm text-muted-foreground mt-1">{module.title[lang]}</p>
          </div>

          <div className="bg-military-green/5 border-2 border-military-green/20 p-4 mb-8">
            <p className="text-sm text-muted-foreground">
              {lang === 'es'
                ? 'Esta evaluación es independiente del contenido de la lección. Asegúrese de haber estudiado el material antes de comenzar.'
                : 'This quiz is independent from the lesson content. Make sure you have studied the material before starting.'}
            </p>
          </div>

          <MiniQuiz questions={quiz} courseId={courseId} moduleId={moduleId} lessonId={lessonId} />
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default QuizView;
