import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Trash2, Download, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export type VoiceEvalStatus =
  | 'correct'
  | 'tooFast'
  | 'tooLong'
  | 'noExecutive'
  | 'weakExecutive'
  | 'tooQuiet';

export interface VoiceEvalResult {
  status: VoiceEvalStatus;
  exampleIndex: number;
  preventiveMs: number;
  executiveMs: number;
  pauseMs: number;
}

interface Props {
  onEvaluation?: (result: VoiceEvalResult) => void;
}

const SAMPLE_RATE_HZ = 30;

const VoiceCommandRecorder = ({ onEvaluation }: Props) => {
  const { t } = useI18n();
  const examples = t.drill.voiceCommands.examples;
  const ev = t.drill.voiceCommands.evaluation;

  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState(0);
  const [selectedExample, setSelectedExample] = useState(0);
  const [result, setResult] = useState<VoiceEvalResult | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const samplesRef = useRef<number[]>([]);
  const sampleTimerRef = useRef<number | null>(null);
  const selectedRef = useRef(0);

  useEffect(() => {
    selectedRef.current = selectedExample;
  }, [selectedExample]);

  const cleanup = () => {
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (sampleTimerRef.current) window.clearInterval(sampleTimerRef.current);
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    analyserRef.current = null;
    setLevel(0);
  };

  useEffect(() => () => cleanup(), []);

  const evaluate = (samples: number[]): VoiceEvalResult => {
    const peak = Math.max(0.001, ...samples);
    const dynamicTh = Math.max(0.06, peak * 0.28);
    const minMs = (n: number) => (n * 1000) / SAMPLE_RATE_HZ;

    if (peak < 0.08) {
      return { status: 'tooQuiet', exampleIndex: selectedRef.current, preventiveMs: 0, executiveMs: 0, pauseMs: 0 };
    }

    // Find voice segments
    const segs: { start: number; end: number }[] = [];
    let inSeg = false;
    let s = 0;
    for (let i = 0; i < samples.length; i++) {
      const on = samples[i] > dynamicTh;
      if (on && !inSeg) { inSeg = true; s = i; }
      else if (!on && inSeg) { inSeg = false; segs.push({ start: s, end: i }); }
    }
    if (inSeg) segs.push({ start: s, end: samples.length });

    // Merge gaps shorter than ~120ms
    const gapMinSamples = Math.round((120 * SAMPLE_RATE_HZ) / 1000);
    const merged: typeof segs = [];
    for (const seg of segs) {
      const last = merged[merged.length - 1];
      if (last && seg.start - last.end <= gapMinSamples) last.end = seg.end;
      else merged.push({ ...seg });
    }
    // Drop tiny blips < 80ms
    const blipMin = Math.round((80 * SAMPLE_RATE_HZ) / 1000);
    const clean = merged.filter((m) => m.end - m.start >= blipMin);

    const totalMs = minMs(samples.length);
    const idx = selectedRef.current;

    if (clean.length === 0) {
      return { status: 'tooQuiet', exampleIndex: idx, preventiveMs: 0, executiveMs: 0, pauseMs: 0 };
    }

    if (clean.length === 1) {
      // Single block — likely no pause = too fast
      const dur = minMs(clean[0].end - clean[0].start);
      if (dur > 2500) return { status: 'tooLong', exampleIndex: idx, preventiveMs: dur, executiveMs: 0, pauseMs: 0 };
      return { status: 'tooFast', exampleIndex: idx, preventiveMs: dur, executiveMs: 0, pauseMs: 0 };
    }

    // Take first segment as preventive, last as executive
    const prev = clean[0];
    const exec = clean[clean.length - 1];
    const preventiveMs = minMs(prev.end - prev.start);
    const executiveMs = minMs(exec.end - exec.start);
    const pauseMs = minMs(exec.start - prev.end);

    if (totalMs > 5000) {
      return { status: 'tooLong', exampleIndex: idx, preventiveMs, executiveMs, pauseMs };
    }
    if (pauseMs < 130) {
      return { status: 'tooFast', exampleIndex: idx, preventiveMs, executiveMs, pauseMs };
    }
    if (executiveMs > preventiveMs * 1.1 && preventiveMs < 400) {
      return { status: 'tooFast', exampleIndex: idx, preventiveMs, executiveMs, pauseMs };
    }
    if (executiveMs < 120) {
      return { status: 'weakExecutive', exampleIndex: idx, preventiveMs, executiveMs, pauseMs };
    }
    if (executiveMs > 900) {
      return { status: 'weakExecutive', exampleIndex: idx, preventiveMs, executiveMs, pauseMs };
    }
    if (preventiveMs < 300) {
      return { status: 'tooFast', exampleIndex: idx, preventiveMs, executiveMs, pauseMs };
    }
    return { status: 'correct', exampleIndex: idx, preventiveMs, executiveMs, pauseMs };
  };

  const start = async () => {
    setError(null);
    setResult(null);
    samplesRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      const mr = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];
      mr.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(URL.createObjectURL(blob));
        const r = evaluate(samplesRef.current);
        setResult(r);
        onEvaluation?.(r);
      };
      mediaRecorderRef.current = mr;
      mr.start();

      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.frequencyBinCount);
      const computeLevel = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        return Math.min(1, Math.sqrt(sum / data.length) * 3);
      };

      const tick = () => {
        setLevel(computeLevel());
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();

      // Fixed-rate sampling for evaluation
      sampleTimerRef.current = window.setInterval(() => {
        samplesRef.current.push(computeLevel());
      }, 1000 / SAMPLE_RATE_HZ);

      setElapsed(0);
      timerRef.current = window.setInterval(() => setElapsed((e) => e + 1), 1000);
      setRecording(true);
    } catch {
      setError(t.drill.voiceCommands.permissionDenied);
    }
  };

  const stop = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    cleanup();
  };

  const remove = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setElapsed(0);
    setResult(null);
  };

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const bars = 24;

  const isCorrect = result?.status === 'correct';
  const evalLabel: Record<VoiceEvalStatus, { title: string; desc: string }> = {
    correct: { title: ev.correct, desc: ev.correctDesc },
    tooFast: { title: ev.tooFast, desc: ev.tooFastDesc },
    tooLong: { title: ev.tooLong, desc: ev.tooLongDesc },
    noExecutive: { title: ev.noExecutive, desc: ev.noExecutiveDesc },
    weakExecutive: { title: ev.weakExecutive, desc: ev.weakExecutiveDesc },
    tooQuiet: { title: ev.tooQuiet, desc: ev.tooQuietDesc },
  };

  return (
    <div className="border-2 border-foreground bg-card p-6">
      <div className="flex items-start justify-between mb-1 gap-4 flex-wrap">
        <div>
          <h3 className="text-lg font-black">{t.drill.voiceCommands.recorderTitle}</h3>
          <p className="text-xs text-muted-foreground mt-1">{t.drill.voiceCommands.recorderSubtitle}</p>
        </div>
        <span className="text-military-label">REC · {fmt(elapsed)}</span>
      </div>

      {/* Practice prompt */}
      <div className="mt-5 border-2 border-military-green/40 bg-[hsl(var(--military-green-pastel))] p-4">
        <p className="text-military-label mb-2">{t.drill.voiceCommands.practiceWith}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => setSelectedExample(i)}
              className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 border-2 ${
                selectedExample === i
                  ? 'border-military-green bg-military-green text-white'
                  : 'border-foreground/30 hover:border-foreground'
              }`}
            >
              {ex.prev.replace('…', '')}
            </button>
          ))}
        </div>
        <p className="text-lg font-black leading-snug">
          <span className="text-muted-foreground">{examples[selectedExample].prev}</span>{' '}
          <span className="text-military-green">{examples[selectedExample].exec}</span>
        </p>
      </div>

      {/* VU Meter */}
      <div className="mt-5 flex items-end justify-center gap-1 h-16 border-2 border-foreground bg-background p-2">
        {Array.from({ length: bars }).map((_, i) => {
          const threshold = (i + 1) / bars;
          const active = recording && level >= threshold * 0.8;
          const heightPct = recording ? Math.max(10, level * 100 * (1 - Math.abs(i - bars / 2) / bars)) : 8;
          return (
            <div
              key={i}
              className={`w-2 transition-all duration-75 ${
                active
                  ? i > bars * 0.75
                    ? 'bg-destructive'
                    : 'bg-military-green'
                  : 'bg-muted'
              }`}
              style={{ height: `${heightPct}%` }}
            />
          );
        })}
      </div>

      {/* Controls */}
      <div className="mt-5 flex flex-wrap gap-2">
        {!recording ? (
          <Button
            onClick={start}
            className="rounded-none font-bold uppercase tracking-widest text-xs bg-military-green hover:bg-military-green/90 text-white"
          >
            <Mic className="h-4 w-4 mr-2" />
            {t.drill.voiceCommands.record}
          </Button>
        ) : (
          <Button
            onClick={stop}
            variant="destructive"
            className="rounded-none font-bold uppercase tracking-widest text-xs"
          >
            <Square className="h-4 w-4 mr-2" />
            {t.drill.voiceCommands.stop}
          </Button>
        )}
        {audioUrl && !recording && (
          <>
            <Button
              variant="outline"
              onClick={() => new Audio(audioUrl).play()}
              className="border-2 border-foreground rounded-none font-bold uppercase tracking-widest text-xs"
            >
              <Play className="h-4 w-4 mr-2" />
              {t.drill.voiceCommands.play}
            </Button>
            <a
              href={audioUrl}
              download={`voz-mando-${Date.now()}.webm`}
              className="inline-flex items-center border-2 border-foreground px-4 py-2 font-bold uppercase tracking-widest text-xs hover:bg-accent"
            >
              <Download className="h-4 w-4 mr-2" />
              {t.drill.voiceCommands.download}
            </a>
            <Button
              variant="ghost"
              onClick={remove}
              className="rounded-none font-bold uppercase tracking-widest text-xs"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t.drill.voiceCommands.delete}
            </Button>
          </>
        )}
      </div>

      {audioUrl && !recording && (
        <audio src={audioUrl} controls className="w-full mt-4" />
      )}

      {/* Evaluation */}
      {result && (
        <div
          className={`mt-4 border-2 p-4 ${
            isCorrect
              ? 'border-military-green bg-[hsl(var(--military-green-pastel))]'
              : 'border-destructive bg-destructive/5'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? (
              <CheckCircle2 className="h-5 w-5 text-military-green" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive" />
            )}
            <p className="text-military-label">{ev.title}</p>
            <h4 className={`text-sm font-black ${isCorrect ? 'text-military-green' : 'text-destructive'}`}>
              {evalLabel[result.status].title}
            </h4>
          </div>
          <p className="text-xs text-foreground/80 mb-3">{evalLabel[result.status].desc}</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="border border-foreground/30 p-2 bg-background">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{ev.preventiveDuration}</p>
              <p className="font-mono text-sm font-bold">{(result.preventiveMs / 1000).toFixed(2)}s</p>
            </div>
            <div className="border border-foreground/30 p-2 bg-background">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{ev.pause}</p>
              <p className="font-mono text-sm font-bold">{(result.pauseMs / 1000).toFixed(2)}s</p>
            </div>
            <div className="border border-foreground/30 p-2 bg-background">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{ev.executiveDuration}</p>
              <p className="font-mono text-sm font-bold">{(result.executiveMs / 1000).toFixed(2)}s</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-start gap-2 border-2 border-destructive p-3 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}
    </div>
  );
};

export default VoiceCommandRecorder;
