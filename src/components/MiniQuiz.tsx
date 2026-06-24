import { useState, useMemo, useEffect } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/button';
import type { QuizQuestion } from '@/data/courses';
import { CheckCircle, XCircle } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { supabase } from '@/lib/supabase'; // Asegúrate de tener esta ruta correcta

interface MiniQuizProps {
  questions: QuizQuestion[];
  courseId?: string;
  moduleId?: string;
  lessonId?: string;
}

// Fisher–Yates shuffle (returns new array)
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const MiniQuiz = ({ questions, courseId, moduleId, lessonId }: MiniQuizProps) => {
  const { t, lang } = useI18n();
  const { saveQuizResult } = useProgress();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [attemptSeed, setAttemptSeed] = useState(0);

  const shuffledQuestions = useMemo(() => {
    return shuffle(questions).map((q) => {
      const indices = shuffle(q.options.es.map((_, i) => i));
      const newCorrectIndex = indices.indexOf(q.correctIndex);
      return {
        ...q,
        options: {
          es: indices.map((i) => q.options.es[i]),
          en: indices.map((i) => q.options.en[i]),
        },
        correctIndex: newCorrectIndex,
      };
    });
  }, [questions, attemptSeed]);

  const selectAnswer = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < shuffledQuestions.length) return;

    // Formateamos las respuestas para el servidor
    const respuestasFormateadas = shuffledQuestions.map(q => ({
        id: q.id,
        respuesta: q.options.es[answers[q.id]] 
    }));

    try {
        const { data: { session } } = await supabase.auth.getSession();

        // Llamada al servidor (Ajusta el puerto 8000 si es necesario)
        const response = await fetch('http://localhost:8000/api/evaluar', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session?.access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                examenId: courseId || 'default_exam',
                respuestas: respuestasFormateadas
            })
        });

        if (response.ok) {
            const resultado = await response.json();
            console.log("Evaluación procesada por el servidor:", resultado);
        }
    } catch (error) {
        console.error("Error al conectar con el servidor de evaluación:", error);
    }

    setSubmitted(true);
  };

  const score = submitted
    ? shuffledQuestions.filter((q) => answers[q.id] === q.correctIndex).length
    : 0;
  const passed = score >= Math.ceil(shuffledQuestions.length * 0.6);

  useEffect(() => {
    if (submitted && courseId && moduleId && lessonId) {
      saveQuizResult(courseId, moduleId, lessonId, score, shuffledQuestions.length);
    }
  }, [submitted, courseId, moduleId, lessonId, score, shuffledQuestions.length]);

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
    setAttemptSeed((s) => s + 1);
  };

  return (
    <div>
      <h2 className="text-xl font-black mb-1">{t.lesson.quizTitle}</h2>
      <p className="text-sm text-muted-foreground mb-6">{t.lesson.quizSubtitle}</p>

      <div className="space-y-6">
        {shuffledQuestions.map((q, qi) => (
          <div key={q.id} className="border-2 border-foreground p-5">
            <p className="font-semibold text-sm mb-3">
              <span className="font-mono text-muted-foreground mr-2">{qi + 1}.</span>
              {q.question[lang]}
            </p>
            <div className="space-y-2">
              {q.options[lang].map((option, oi) => {
                const isSelected = answers[q.id] === oi;
                const isCorrect = q.correctIndex === oi;
                let borderClass = 'border-border';
                if (submitted && isSelected && isCorrect) borderClass = 'border-foreground bg-accent';
                if (submitted && isSelected && !isCorrect) borderClass = 'border-destructive bg-destructive/5';
                if (submitted && !isSelected && isCorrect) borderClass = 'border-foreground/30 bg-accent/50';
                if (!submitted && isSelected) borderClass = 'border-foreground bg-accent';

                return (
                  <button
                    key={oi}
                    onClick={() => selectAnswer(q.id, oi)}
                    className={`w-full text-left p-3 border-2 text-sm transition-colors flex items-center justify-between ${borderClass}`}
                    disabled={submitted}
                  >
                    <span>{option}</span>
                    {submitted && isSelected && isCorrect && <CheckCircle className="h-4 w-4 text-foreground" />}
                    {submitted && isSelected && !isCorrect && <XCircle className="h-4 w-4 text-destructive" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!submitted ? (
        <Button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < shuffledQuestions.length}
          className="mt-6 font-bold uppercase tracking-widest text-sm rounded-none"
        >
          {t.lesson.submit}
        </Button>
      ) : (
        <div className="mt-6 border-2 border-foreground p-5 flex items-center justify-between">
          <div>
            <p className="font-black text-lg">
              {t.lesson.score}: {score} {t.lesson.of} {shuffledQuestions.length}
            </p>
            <p className={`text-sm font-semibold ${passed ? 'text-foreground' : 'text-destructive'}`}>
              {passed ? t.lesson.passed : t.lesson.failed}
            </p>
          </div>
          {!passed && (
            <Button onClick={reset} variant="outline" className="border-2 border-foreground rounded-none font-bold uppercase tracking-widest text-xs">
              {lang === 'es' ? 'Reintentar' : 'Retry'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default MiniQuiz;