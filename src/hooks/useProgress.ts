import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ProgressRow {
  course_id: string;
  module_id: string;
  lesson_id: string;
  completed: boolean;
  quiz_score: number | null;
  quiz_total: number | null;
}

export const useProgress = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<ProgressRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) { setRows([]); setLoading(false); return; }
    const { data } = await supabase
      .from('lesson_progress')
      .select('course_id, module_id, lesson_id, completed, quiz_score, quiz_total')
      .eq('user_id', user.id);
    setRows((data ?? []) as ProgressRow[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const saveQuizResult = useCallback(async (
    courseId: string, moduleId: string, lessonId: string,
    score: number, total: number,
  ) => {
    if (!user) return;
    const passed = score >= Math.ceil(total * 0.6);
    await supabase.from('lesson_progress').upsert({
      user_id: user.id,
      course_id: courseId,
      module_id: moduleId,
      lesson_id: lessonId,
      completed: passed,
      quiz_score: score,
      quiz_total: total,
      completed_at: passed ? new Date().toISOString() : null,
    }, { onConflict: 'user_id,course_id,module_id,lesson_id' });
    refresh();
  }, [user, refresh]);

  const courseProgressPct = (courseId: string, totalLessons: number) => {
    if (totalLessons === 0) return 0;
    const done = rows.filter((r) => r.course_id === courseId && r.completed).length;
    return Math.round((done / totalLessons) * 100);
  };

  return { rows, loading, refresh, saveQuizResult, courseProgressPct };
};
