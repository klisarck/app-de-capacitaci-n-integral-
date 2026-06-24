import { useI18n } from '@/contexts/I18nContext';
import AppLayout from '@/components/AppLayout';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle,
  BarChart3,
  Bell,
  Target,
  Flame,
  Trophy,
  Clock,
  ArrowRight,
  Sparkles,
  Crosshair,
  Award,
} from 'lucide-react';
import { sampleCourses } from '@/data/courses';
import courseHistoria from '@/assets/course-historia.jpg';
import courseLeyes from '@/assets/course-leyes.jpg';
import courseOrden from '@/assets/course-orden.jpg';
import { useUserRole } from '@/hooks/useUserRole';
import { useProgress } from '@/hooks/useProgress';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const courseImages: Record<string, string> = {
  'historia-militar': courseHistoria,
  'leyes-reglamentos': courseLeyes,
  'orden-cerrado': courseOrden,
};

const totalLessonsPerCourse = sampleCourses.reduce<Record<string, number>>((acc, c) => {
  acc[c.id] = c.modules.reduce((s, m) => s + m.lessons.length, 0);
  return acc;
}, {});

const Dashboard = () => {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const { isStudent, isStaff, verificationStatus } = useUserRole();
  const { rows: progressRows } = useProgress();
  const [firstName, setFirstName] = useState<string>('');

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('first_name').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => setFirstName(data?.first_name || ''));
  }, [user]);

  const lessonsCompleted = progressRows.filter((r) => r.completed).length;
  const quizzesPassed = progressRows.filter((r) => r.completed && r.quiz_score !== null).length;
  const totalLessons = Object.values(totalLessonsPerCourse).reduce((a, b) => a + b, 0);
  const overallPct = totalLessons === 0 ? 0 : Math.round((lessonsCompleted / totalLessons) * 100);

  const courseProgress: Record<string, number> = sampleCourses.reduce((acc, c) => {
    const total = totalLessonsPerCourse[c.id] || 0;
    const done = progressRows.filter((r) => r.course_id === c.id && r.completed).length;
    acc[c.id] = total === 0 ? 0 : Math.round((done / total) * 100);
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    { label: t.dashboard.coursesEnrolled, value: String(sampleCourses.length), icon: BookOpen, accent: 'from-military-green/20 to-transparent' },
    { label: t.dashboard.lessonsCompleted, value: String(lessonsCompleted), icon: CheckCircle, accent: 'from-military-green/20 to-transparent' },
    { label: t.dashboard.quizzesPassed, value: String(quizzesPassed), icon: BarChart3, accent: 'from-military-green/20 to-transparent' },
  ];

  const achievements = isStudent ? [] : (lang === 'es'
    ? [
        { icon: Flame, label: 'Racha 5 días', color: 'text-orange-600' },
        { icon: Trophy, label: 'Top 12%', color: 'text-yellow-600' },
        { icon: Crosshair, label: 'Precisión 89%', color: 'text-military-green' },
        { icon: Award, label: '3 medallas', color: 'text-blue-600' },
      ]
    : [
        { icon: Flame, label: '5-day streak', color: 'text-orange-600' },
        { icon: Trophy, label: 'Top 12%', color: 'text-yellow-600' },
        { icon: Crosshair, label: '89% accuracy', color: 'text-military-green' },
        { icon: Award, label: '3 medals', color: 'text-blue-600' },
      ]);

  const notifications = lang === 'es'
    ? [
        { text: 'Nuevo módulo disponible en "Historia Militar de Venezuela"', time: 'Hace 2h', dot: 'bg-military-green' },
        { text: 'Evaluación pendiente en "Orden Cerrado"', time: 'Hace 1d', dot: 'bg-orange-500' },
        { text: 'Bienvenido a la plataforma UNEFA ACI', time: 'Hace 3d', dot: 'bg-muted-foreground' },
      ]
    : [
        { text: 'New module available in "Military History of Venezuela"', time: '2h ago', dot: 'bg-military-green' },
        { text: 'Pending quiz in "Close Order Drill"', time: '1d ago', dot: 'bg-orange-500' },
        { text: 'Welcome to the UNEFA ACI platform', time: '3d ago', dot: 'bg-muted-foreground' },
      ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
  };

  return (
    <AppLayout isLoggedIn userName={firstName || 'Estudiante'}>
      <div className="container mx-auto px-4 py-10 relative">
        {/* Subtle background grid pattern */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <motion.div variants={containerVariants} initial="hidden" animate="show">
          {/* Welcome Hero */}
          <motion.div
            variants={itemVariants}
            className="mb-10 relative overflow-hidden border-2 border-foreground p-8 bg-gradient-to-br from-card via-background to-military-green/5"
          >
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-military-green/10 blur-3xl" />
            {isStaff && verificationStatus === 'approved' && (
              <div className="absolute right-8 top-8 hidden md:flex items-center gap-1.5 text-military-label">
                <Sparkles className="h-3.5 w-3.5 text-military-green" />
                <span>{lang === 'es' ? 'En servicio activo' : 'On active duty'}</span>
              </div>
            )}

            <p className="text-military-label mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-military-green inline-block animate-pulse" />
              {t.dashboard.overview}
            </p>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
              {t.dashboard.welcome},{' '}
              <span className="bg-gradient-to-r from-military-green to-foreground bg-clip-text text-transparent">
                {firstName || (lang === 'es' ? 'Estudiante' : 'Student')}
              </span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              {lang === 'es'
                ? `Continúa tu formación. Has completado ${lessonsCompleted} de ${totalLessons} lecciones.`
                : `Continue your training. You've completed ${lessonsCompleted} of ${totalLessons} lessons.`}
            </p>

            {/* Achievement chips */}
            <div className="mt-6 flex flex-wrap gap-2">
              {achievements.map((a, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-foreground bg-background text-xs font-bold uppercase tracking-wider"
                >
                  <a.icon className={`h-3.5 w-3.5 ${a.color}`} strokeWidth={2.5} />
                  {a.label}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative border-2 border-foreground p-6 bg-card overflow-hidden group cursor-default"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                <div className="absolute top-0 left-0 h-1 w-0 bg-military-green group-hover:w-full transition-all duration-500" />
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-5xl font-black tracking-tight mb-1">{stat.value}</p>
                    <p className="text-military-label">{stat.label}</p>
                  </div>
                  <div className="p-2.5 bg-military-green/10 border-2 border-military-green/30 group-hover:bg-military-green group-hover:border-military-green transition-colors duration-300">
                    <stat.icon
                      className="h-6 w-6 text-military-green group-hover:text-white transition-colors duration-300"
                      strokeWidth={2}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Progress + Notifications */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {/* Overall Progress */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-1 relative border-2 border-foreground p-6 bg-card overflow-hidden"
            >
              <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-military-green/10 blur-2xl" />
              <h2 className="font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                <Target className="h-4 w-4 text-military-green" />
                {t.dashboard.progress}
              </h2>

              {/* Circular progress */}
              <div className="relative flex items-center justify-center my-4">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    stroke="hsl(var(--secondary))"
                    strokeWidth="10"
                    fill="none"
                  />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="52"
                    stroke="hsl(var(--military-green))"
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="square"
                    strokeDasharray={2 * Math.PI * 52}
                    initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - overallPct / 100) }}
                    transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-military-green">{overallPct}%</span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {lang === 'es' ? 'Total' : 'Total'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3 mt-2">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  {lang === 'es' ? 'Última sesión' : 'Last session'}
                </span>
                <span className="font-mono font-semibold">
                  {lang === 'es' ? 'Hace 2h' : '2h ago'}
                </span>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-2 border-2 border-foreground p-6 bg-card"
            >
              <h2 className="font-bold text-sm uppercase tracking-widest mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-military-green" />
                  {t.dashboard.notifications}
                </span>
                <span className="px-2 py-0.5 bg-military-green text-white text-[10px] font-mono">
                  {notifications.length}
                </span>
              </h2>
              <ul className="space-y-1">
                {notifications.map((n, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-3 text-sm p-3 -mx-3 hover:bg-muted/50 cursor-pointer transition-colors group"
                  >
                    <span
                      className={`w-2 h-2 ${n.dot} mt-1.5 flex-shrink-0 group-hover:scale-150 transition-transform`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="leading-snug">{n.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 font-mono">{n.time}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Continue Learning */}
          <motion.div variants={itemVariants}>
            <div className="flex items-end justify-between mb-4">
              <h2 className="font-bold text-sm uppercase tracking-widest">
                {t.dashboard.continueLearning}
              </h2>
              <Link
                to="/courses"
                className="text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-military-green transition-colors flex items-center gap-1 group"
              >
                {lang === 'es' ? 'Ver todos' : 'View all'}
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {sampleCourses.map((course, i) => {
                const progress = courseProgress[course.id] ?? 0;
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                    whileHover={{ y: -6 }}
                  >
                    <Link
                      to={`/courses/${course.id}`}
                      className="block border-2 border-foreground overflow-hidden hover:border-military-green transition-all duration-300 group bg-card hover:shadow-[8px_8px_0_0_hsl(var(--military-green))]"
                    >
                      {courseImages[course.id] && (
                        <div className="h-44 overflow-hidden relative">
                          <img
                            src={courseImages[course.id]}
                            alt={course.title[lang]}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                            width={768}
                            height={512}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          <div className="absolute top-3 left-3 px-2 py-1 bg-background/90 backdrop-blur-sm border border-foreground text-[10px] font-bold uppercase tracking-widest">
                            {course.modules.length} {t.courses.modules}
                          </div>
                          <div className="absolute bottom-3 left-3 right-3">
                            <div className="flex items-center justify-between text-white text-[10px] font-mono mb-1.5">
                              <span className="uppercase tracking-widest">
                                {lang === 'es' ? 'Progreso' : 'Progress'}
                              </span>
                              <span className="font-bold">{progress}%</span>
                            </div>
                            <div className="h-1 bg-white/30 overflow-hidden">
                              <motion.div
                                className="h-full bg-military-green"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, delay: 0.7 + i * 0.1 }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="font-bold mb-2 group-hover:text-military-green transition-colors">
                          {course.title[lang]}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {course.description[lang]}
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <span className="text-military-label">
                            {progress > 0
                              ? lang === 'es'
                                ? 'Continuar'
                                : 'Continue'
                              : lang === 'es'
                                ? 'Comenzar'
                                : 'Start'}
                          </span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 group-hover:text-military-green transition-all" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
