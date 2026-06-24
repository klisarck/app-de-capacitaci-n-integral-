import { useState } from 'react';
import { Edit } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { useAdminStore } from '@/stores/adminStore';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, ChevronDown, ChevronRight, ArrowLeft, Save, BookOpen } from 'lucide-react';
import type { Course, Module, Lesson, InteractiveElement } from '@/data/courses';
import TimelineBuilder from '@/components/admin/TimelineBuilder';
import BattleMapBuilder from '@/components/admin/BattleMapBuilder';
import LessonPreview from '@/components/admin/LessonPreview';
import type { TimelineEvent } from '@/components/InteractiveTimeline';
import { toast } from '@/hooks/use-toast';

const AdminCourseEditor = () => {
  const { lang } = useI18n();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { customCourses, addCourse, updateCourse } = useAdminStore();
  const isEs = lang === 'es';

  const existing = courseId ? customCourses.find((c) => c.id === courseId) : null;

  const [title, setTitle] = useState<{ es: string; en: string }>(existing?.title || { es: '', en: '' });
  const [description, setDescription] = useState<{ es: string; en: string }>(existing?.description || { es: '', en: '' });
  const [modules, setModules] = useState<Module[]>(existing?.modules || []);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<{ moduleId: string; lessonIndex: number } | null>(null);

  const addModule = () => {
    const id = `mod-${Date.now()}`;
    setModules([...modules, { id, title: { es: '', en: '' }, lessons: [] }]);
    setExpandedModule(id);
  };

  const updateModule = (modId: string, field: string, value: string) => {
    setModules(modules.map((m) => m.id === modId ? { ...m, title: { ...m.title, [lang]: value } } : m));
  };

  const removeModule = (modId: string) => {
    setModules(modules.filter((m) => m.id !== modId));
  };

  const addLesson = (modId: string) => {
    setModules(modules.map((m) => {
      if (m.id !== modId) return m;
      const lesson: Lesson = {
        id: `lesson-${Date.now()}`,
        title: { es: '', en: '' },
        type: 'text',
        content: { es: '', en: '' },
        interactiveElements: [],
      };
      return { ...m, lessons: [...m.lessons, lesson] };
    }));
  };

  const updateLesson = (modId: string, lessonIdx: number, data: Partial<Lesson>) => {
    setModules(modules.map((m) => {
      if (m.id !== modId) return m;
      const lessons = [...m.lessons];
      lessons[lessonIdx] = { ...lessons[lessonIdx], ...data };
      return { ...m, lessons };
    }));
  };

  const removeLesson = (modId: string, lessonIdx: number) => {
    setModules(modules.map((m) => {
      if (m.id !== modId) return m;
      return { ...m, lessons: m.lessons.filter((_, i) => i !== lessonIdx) };
    }));
  };

  const addInteractiveElement = (modId: string, lessonIdx: number, type: InteractiveElement['type']) => {
    const el: InteractiveElement = type === 'video'
      ? { type: 'video', videoId: '', videoTitle: { es: '', en: '' } }
      : type === 'timeline'
      ? { type: 'timeline', timelineData: [], timelineTitle: { es: '', en: '' } }
      : { type: 'battlemap', battleMapData: { title: { es: '', en: '' }, movements: [], locations: [] } };

    setModules(modules.map((m) => {
      if (m.id !== modId) return m;
      const lessons = [...m.lessons];
      const lesson = lessons[lessonIdx];
      lessons[lessonIdx] = { ...lesson, interactiveElements: [...(lesson.interactiveElements || []), el] };
      return { ...m, lessons };
    }));
  };

  const updateInteractiveElement = (modId: string, lessonIdx: number, elIdx: number, data: Partial<InteractiveElement>) => {
    setModules(modules.map((m) => {
      if (m.id !== modId) return m;
      const lessons = [...m.lessons];
      const elements = [...(lessons[lessonIdx].interactiveElements || [])];
      elements[elIdx] = { ...elements[elIdx], ...data };
      lessons[lessonIdx] = { ...lessons[lessonIdx], interactiveElements: elements };
      return { ...m, lessons };
    }));
  };

  const removeInteractiveElement = (modId: string, lessonIdx: number, elIdx: number) => {
    setModules(modules.map((m) => {
      if (m.id !== modId) return m;
      const lessons = [...m.lessons];
      lessons[lessonIdx] = {
        ...lessons[lessonIdx],
        interactiveElements: (lessons[lessonIdx].interactiveElements || []).filter((_, i) => i !== elIdx),
      };
      return { ...m, lessons };
    }));
  };

  const handleSave = () => {
    const id = courseId || `course-${Date.now()}`;
    const course: Course = { id, title, description, modules };
    if (courseId) {
      updateCourse(courseId, course);
    } else {
      addCourse(course);
    }
    toast({ title: isEs ? 'Curso guardado' : 'Course saved' });
    navigate('/admin');
  };

  // Lesson editor sub-view
  const currentEditLesson = editingLesson
    ? modules.find((m) => m.id === editingLesson.moduleId)?.lessons[editingLesson.lessonIndex]
    : null;

  if (editingLesson && currentEditLesson) {
    const modId = editingLesson.moduleId;
    const li = editingLesson.lessonIndex;
    return (
      <div className="min-h-screen bg-background">
        <Header isLoggedIn userName="Profesor" />
        <main className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={() => setEditingLesson(null)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> {isEs ? 'Volver al curso' : 'Back to course'}
          </Button>

          <h2 className="text-xl font-bold mb-4">
            {isEs ? 'Editor de Lección' : 'Lesson Editor'}: {currentEditLesson.title[lang] || '...'}
          </h2>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: editor */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder={`${isEs ? 'Título' : 'Title'} (ES)`} value={currentEditLesson.title.es}
                  onChange={(e) => updateLesson(modId, li, { title: { ...currentEditLesson.title, es: e.target.value } })} />
                <Input placeholder={`${isEs ? 'Título' : 'Title'} (EN)`} value={currentEditLesson.title.en}
                  onChange={(e) => updateLesson(modId, li, { title: { ...currentEditLesson.title, en: e.target.value } })} />
              </div>

              <Textarea
                placeholder={`${isEs ? 'Contenido de la lección' : 'Lesson content'} (${lang.toUpperCase()})`}
                value={currentEditLesson.content[lang]}
                onChange={(e) => updateLesson(modId, li, { content: { ...currentEditLesson.content, [lang]: e.target.value } })}
                rows={8}
              />

              {/* Interactive element tools */}
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-3">
                  {isEs ? '➕ Agregar Elemento Interactivo' : '➕ Add Interactive Element'}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => addInteractiveElement(modId, li, 'video')}>
                    🎬 Video
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => addInteractiveElement(modId, li, 'timeline')}>
                    🕐 {isEs ? 'Línea de Tiempo' : 'Timeline'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => addInteractiveElement(modId, li, 'battlemap')}>
                    🗺️ {isEs ? 'Mapa de Batalla' : 'Battle Map'}
                  </Button>
                </div>
              </div>

              {/* Interactive elements editors */}
              {(currentEditLesson.interactiveElements || []).map((el, elIdx) => (
                <div key={elIdx} className="relative">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-10 h-7 w-7"
                    onClick={() => removeInteractiveElement(modId, li, elIdx)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>

                  {el.type === 'video' && (
                    <Card className="border-2 border-primary/20">
                      <CardContent className="p-4 space-y-2">
                        <p className="text-xs font-bold">🎬 Video</p>
                        <Input placeholder="YouTube Video ID" value={el.videoId || ''}
                          onChange={(e) => updateInteractiveElement(modId, li, elIdx, { videoId: e.target.value })} />
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="Título (ES)" value={el.videoTitle?.es || ''}
                            onChange={(e) => updateInteractiveElement(modId, li, elIdx, { videoTitle: { es: e.target.value, en: el.videoTitle?.en || '' } })} />
                          <Input placeholder="Title (EN)" value={el.videoTitle?.en || ''}
                            onChange={(e) => updateInteractiveElement(modId, li, elIdx, { videoTitle: { es: el.videoTitle?.es || '', en: e.target.value } })} />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {el.type === 'timeline' && (
                    <TimelineBuilder
                      events={el.timelineData || []}
                      onChange={(events) => updateInteractiveElement(modId, li, elIdx, { timelineData: events })}
                      title={el.timelineTitle || { es: '', en: '' }}
                      onTitleChange={(t) => updateInteractiveElement(modId, li, elIdx, { timelineTitle: t })}
                    />
                  )}

                  {el.type === 'battlemap' && el.battleMapData && (
                    <BattleMapBuilder
                      title={el.battleMapData.title}
                      onTitleChange={(t) => updateInteractiveElement(modId, li, elIdx, { battleMapData: { ...el.battleMapData!, title: t } })}
                      movements={el.battleMapData.movements}
                      onMovementsChange={(m) => updateInteractiveElement(modId, li, elIdx, { battleMapData: { ...el.battleMapData!, movements: m } })}
                      locations={el.battleMapData.locations}
                      onLocationsChange={(l) => updateInteractiveElement(modId, li, elIdx, { battleMapData: { ...el.battleMapData!, locations: l } })}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Right: preview */}
            <div className="lg:sticky lg:top-20 lg:self-start">
              <LessonPreview content={currentEditLesson.content} interactiveElements={currentEditLesson.interactiveElements || []} />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn userName="Profesor" />
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> {isEs ? 'Volver al panel' : 'Back to panel'}
        </Button>

        <h1 className="text-2xl font-heading font-black mb-6">
          {courseId ? (isEs ? 'Editar Curso' : 'Edit Course') : (isEs ? 'Crear Nuevo Curso' : 'Create New Course')}
        </h1>

        <div className="space-y-6">
          {/* Course info */}
          <Card className="border-2">
            <CardHeader><CardTitle className="text-base">{isEs ? 'Información del Curso' : 'Course Information'}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder={`${isEs ? 'Título' : 'Title'} (ES)`} value={title.es} onChange={(e) => setTitle({ ...title, es: e.target.value })} />
                <Input placeholder={`${isEs ? 'Título' : 'Title'} (EN)`} value={title.en} onChange={(e) => setTitle({ ...title, en: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Textarea placeholder={`${isEs ? 'Descripción' : 'Description'} (ES)`} value={description.es} onChange={(e) => setDescription({ ...description, es: e.target.value })} rows={2} />
                <Textarea placeholder={`${isEs ? 'Descripción' : 'Description'} (EN)`} value={description.en} onChange={(e) => setDescription({ ...description, en: e.target.value })} rows={2} />
              </div>
            </CardContent>
          </Card>

          {/* Modules */}
          <div className="space-y-3">
            <h2 className="font-bold">{isEs ? 'Módulos' : 'Modules'}</h2>
            {modules.map((mod) => (
              <Card key={mod.id} className="border-2">
                <div className="flex items-center gap-2 px-4 py-3 cursor-pointer bg-muted/30"
                  onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}>
                  {expandedModule === mod.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm flex-1">{mod.title[lang] || (isEs ? '(sin título)' : '(untitled)')}</span>
                  <span className="text-xs text-muted-foreground">{mod.lessons.length} {isEs ? 'lecciones' : 'lessons'}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); removeModule(mod.id); }}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>

                {expandedModule === mod.id && (
                  <CardContent className="space-y-3 pt-3">
                    <Input placeholder={`${isEs ? 'Nombre del módulo' : 'Module name'} (${lang.toUpperCase()})`}
                      value={mod.title[lang]} onChange={(e) => updateModule(mod.id, 'title', e.target.value)} />

                    {mod.lessons.map((lesson, li) => (
                      <div key={lesson.id} className="flex items-center gap-2 p-2 border rounded bg-background">
                        <span className="text-xs text-muted-foreground w-6">{li + 1}.</span>
                        <span className="text-sm flex-1">{lesson.title[lang] || (isEs ? '(sin título)' : '(untitled)')}</span>
                        <Button size="sm" variant="outline" className="text-xs" onClick={() => setEditingLesson({ moduleId: mod.id, lessonIndex: li })}>
                          <Edit className="h-3 w-3 mr-1" /> {isEs ? 'Editar' : 'Edit'}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => removeLesson(mod.id, li)}>
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    ))}

                    <Button onClick={() => addLesson(mod.id)} variant="outline" size="sm" className="w-full border-dashed">
                      <Plus className="h-3.5 w-3.5 mr-1" /> {isEs ? 'Agregar Lección' : 'Add Lesson'}
                    </Button>
                  </CardContent>
                )}
              </Card>
            ))}

            <Button onClick={addModule} variant="outline" className="w-full border-dashed border-2">
              <Plus className="h-4 w-4 mr-1" /> {isEs ? 'Agregar Módulo' : 'Add Module'}
            </Button>
          </div>

          {/* Save */}
          <Button onClick={handleSave} className="w-full" size="lg">
            <Save className="h-4 w-4 mr-2" /> {isEs ? 'Guardar Curso' : 'Save Course'}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AdminCourseEditor;
