import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { useAdminStore } from '@/stores/adminStore';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import SimulationTreeBuilder from '@/components/admin/SimulationTreeBuilder';
import type { SimulationNode, Simulation } from '@/data/simulations';
import { toast } from '@/hooks/use-toast';

const AdminSimulationEditor = () => {
  const { lang } = useI18n();
  const navigate = useNavigate();
  const { addSimulation } = useAdminStore();
  const isEs = lang === 'es';

  const [title, setTitle] = useState<{ es: string; en: string }>({ es: '', en: '' });
  const [description, setDescription] = useState<{ es: string; en: string }>({ es: '', en: '' });
  const [category, setCategory] = useState<{ es: string; en: string }>({ es: '', en: '' });
  const [difficulty, setDifficulty] = useState<'medium' | 'hard' | 'critical'>('hard');
  const [estimatedTime, setEstimatedTime] = useState(20);
  const [nodes, setNodes] = useState<SimulationNode[]>([
    { id: 'start', situation: { es: '', en: '' }, options: [] },
  ]);
  const [startNodeId, setStartNodeId] = useState('start');

  const handleSave = () => {
    const sim: Simulation = {
      id: `sim-${Date.now()}`,
      title, description, difficulty, category, estimatedTime,
      nodes, startNodeId,
    };
    addSimulation(sim);
    toast({ title: isEs ? 'Simulación guardada' : 'Simulation saved' });
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn userName="Profesor" />
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> {isEs ? 'Volver al panel' : 'Back to panel'}
        </Button>

        <h1 className="text-2xl font-heading font-black mb-6">
          {isEs ? 'Crear Nueva Simulación' : 'Create New Simulation'}
        </h1>

        <div className="space-y-6">
          <Card className="border-2">
            <CardHeader><CardTitle className="text-base">{isEs ? 'Información General' : 'General Information'}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder={`${isEs ? 'Título' : 'Title'} (ES)`} value={title.es} onChange={(e) => setTitle({ ...title, es: e.target.value })} />
                <Input placeholder={`${isEs ? 'Título' : 'Title'} (EN)`} value={title.en} onChange={(e) => setTitle({ ...title, en: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Textarea placeholder={`${isEs ? 'Descripción' : 'Description'} (ES)`} value={description.es} onChange={(e) => setDescription({ ...description, es: e.target.value })} rows={2} />
                <Textarea placeholder={`${isEs ? 'Descripción' : 'Description'} (EN)`} value={description.en} onChange={(e) => setDescription({ ...description, en: e.target.value })} rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder={`${isEs ? 'Categoría' : 'Category'} (ES)`} value={category.es} onChange={(e) => setCategory({ ...category, es: e.target.value })} />
                <Input placeholder={`${isEs ? 'Categoría' : 'Category'} (EN)`} value={category.en} onChange={(e) => setCategory({ ...category, en: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">{isEs ? 'Dificultad' : 'Difficulty'}</label>
                  <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="medium">{isEs ? 'Media' : 'Medium'}</option>
                    <option value="hard">{isEs ? 'Difícil' : 'Hard'}</option>
                    <option value="critical">{isEs ? 'Crítica' : 'Critical'}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">{isEs ? 'Tiempo estimado (min)' : 'Estimated time (min)'}</label>
                  <Input type="number" value={estimatedTime} onChange={(e) => setEstimatedTime(Number(e.target.value))} />
                </div>
              </div>
            </CardContent>
          </Card>

          <SimulationTreeBuilder nodes={nodes} onChange={setNodes} startNodeId={startNodeId} onStartNodeChange={setStartNodeId} />

          <Button onClick={handleSave} className="w-full" size="lg">
            <Save className="h-4 w-4 mr-2" /> {isEs ? 'Guardar Simulación' : 'Save Simulation'}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AdminSimulationEditor;
