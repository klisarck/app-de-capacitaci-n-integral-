import { useI18n } from '@/contexts/I18nContext';
import AppLayout from '@/components/AppLayout';
import { sampleCourses } from '@/data/courses';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const Courses = () => {
  const { t, lang } = useI18n();

  return (
    <AppLayout isLoggedIn>
      <div className="container mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="text-military-label mb-1">{t.courses.subtitle}</p>
          <h1 className="text-3xl md:text-4xl font-black mb-10">{t.courses.title}</h1>

          <div className="space-y-6">
            {sampleCourses.map((course, i) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="block border-2 border-foreground hover:bg-accent transition-colors group"
              >
                <div className="p-6 md:p-8 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-muted-foreground text-sm">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h2 className="text-xl font-bold group-hover:underline underline-offset-4">
                        {course.title[lang]}
                      </h2>
                    </div>
                    <p className="text-sm text-muted-foreground ml-9">
                      {course.description[lang]}
                    </p>
                    <div className="ml-9 mt-3 flex gap-4">
                      <span className="text-military-label">
                        {course.modules.length} {t.courses.modules}
                      </span>
                      <span className="text-military-label">
                        {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} {t.courses.lessons}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Courses;
