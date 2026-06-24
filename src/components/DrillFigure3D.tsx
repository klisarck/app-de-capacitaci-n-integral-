import { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/I18nContext';

type DrillPosition =
  | 'firmes'
  | 'descanso'
  | 'flancoDerecho'
  | 'flancoIzquierdo'
  | 'mediaVuelta'
  | 'marcha'
  | 'saludo';

interface PoseData {
  bodyRotY: number;
  headRotY: number;
  leftArmRotX: number;
  leftArmRotZ: number;
  rightArmRotX: number;
  rightArmRotZ: number;
  leftForearmRotX: number;
  rightForearmRotX: number;
  leftLegRotX: number;
  rightLegRotX: number;
  leftFootRotZ: number;
  rightFootRotZ: number;
  leftLegSpread: number;
  rightLegSpread: number;
}

const poses: Record<DrillPosition, PoseData> = {
  firmes: {
    bodyRotY: 0, headRotY: 0,
    leftArmRotX: 0, leftArmRotZ: 0.08,
    rightArmRotX: 0, rightArmRotZ: -0.08,
    leftForearmRotX: 0, rightForearmRotX: 0,
    leftLegRotX: 0, rightLegRotX: 0,
    leftFootRotZ: -0.35, rightFootRotZ: 0.35,
    leftLegSpread: 0, rightLegSpread: 0,
  },
  descanso: {
    bodyRotY: 0, headRotY: 0,
    leftArmRotX: 0, leftArmRotZ: 0.25,
    rightArmRotX: 0, rightArmRotZ: -0.25,
    leftForearmRotX: -0.5, rightForearmRotX: -0.5,
    leftLegRotX: 0, rightLegRotX: 0,
    leftFootRotZ: -0.2, rightFootRotZ: 0.2,
    leftLegSpread: -0.15, rightLegSpread: 0.15,
  },
  flancoDerecho: {
    bodyRotY: -Math.PI / 2, headRotY: 0,
    leftArmRotX: 0, leftArmRotZ: 0.08,
    rightArmRotX: 0, rightArmRotZ: -0.08,
    leftForearmRotX: 0, rightForearmRotX: 0,
    leftLegRotX: 0, rightLegRotX: 0,
    leftFootRotZ: -0.35, rightFootRotZ: 0.35,
    leftLegSpread: 0, rightLegSpread: 0,
  },
  flancoIzquierdo: {
    bodyRotY: Math.PI / 2, headRotY: 0,
    leftArmRotX: 0, leftArmRotZ: 0.08,
    rightArmRotX: 0, rightArmRotZ: -0.08,
    leftForearmRotX: 0, rightForearmRotX: 0,
    leftLegRotX: 0, rightLegRotX: 0,
    leftFootRotZ: -0.35, rightFootRotZ: 0.35,
    leftLegSpread: 0, rightLegSpread: 0,
  },
  mediaVuelta: {
    bodyRotY: Math.PI, headRotY: 0,
    leftArmRotX: 0, leftArmRotZ: 0.08,
    rightArmRotX: 0, rightArmRotZ: -0.08,
    leftForearmRotX: 0, rightForearmRotX: 0,
    leftLegRotX: 0, rightLegRotX: 0,
    leftFootRotZ: -0.35, rightFootRotZ: 0.35,
    leftLegSpread: 0, rightLegSpread: 0,
  },
  marcha: {
    bodyRotY: 0, headRotY: 0,
    leftArmRotX: 0.6, leftArmRotZ: 0.08,
    rightArmRotX: -0.6, rightArmRotZ: -0.08,
    leftForearmRotX: -0.3, rightForearmRotX: -0.3,
    leftLegRotX: -0.5, rightLegRotX: 0.5,
    leftFootRotZ: 0, rightFootRotZ: 0,
    leftLegSpread: 0, rightLegSpread: 0,
  },
  saludo: {
    bodyRotY: 0, headRotY: 0,
    leftArmRotX: 0, leftArmRotZ: 0.08,
    rightArmRotX: -0.3, rightArmRotZ: -1.2,
    leftForearmRotX: 0, rightForearmRotX: -2.2,
    leftLegRotX: 0, rightLegRotX: 0,
    leftFootRotZ: -0.35, rightFootRotZ: 0.35,
    leftLegSpread: 0, rightLegSpread: 0,
  },
};

const drillSequence: DrillPosition[] = [
  'firmes', 'descanso', 'flancoDerecho', 'flancoIzquierdo', 'mediaVuelta', 'marcha', 'saludo',
];

// Smoothly lerp a value
function useSmoothValue(target: number, speed = 4) {
  const ref = useRef(target);
  return { ref, target };
}

// Color constants
const OLIVE = '#3d5a3a';
const OLIVE_DARK = '#2c4228';
const SKIN = '#c4956a';
const BOOT = '#1a1a1a';
const BELT = '#2a2a2a';
const BERET = '#2c4228';

// Limb component for reuse
function Limb({ position, rotation, length, radius, color }: {
  position: [number, number, number];
  rotation: [number, number, number];
  length: number;
  radius: number;
  color: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, -length / 2, 0]}>
        <capsuleGeometry args={[radius, length, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function SoldierModel({ pose, isMarchCycle }: { pose: DrillPosition; isMarchCycle: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftForearmRef = useRef<THREE.Group>(null);
  const rightForearmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftFootRef = useRef<THREE.Group>(null);
  const rightFootRef = useRef<THREE.Group>(null);

  const currentPose = useRef<PoseData>({ ...poses.firmes });
  const marchPhase = useRef(0);

  useFrame((_, delta) => {
    const target = poses[pose];
    const speed = 5 * delta;

    const lerp = (a: number, b: number) => a + (b - a) * Math.min(speed, 1);

    const cp = currentPose.current;

    // For marcha, oscillate arms and legs
    let tgt = { ...target };
    if (pose === 'marcha') {
      marchPhase.current += delta * 4;
      const swing = Math.sin(marchPhase.current);
      tgt.leftArmRotX = swing * 0.6;
      tgt.rightArmRotX = -swing * 0.6;
      tgt.leftLegRotX = -swing * 0.5;
      tgt.rightLegRotX = swing * 0.5;
    } else {
      marchPhase.current = 0;
    }

    cp.bodyRotY = lerp(cp.bodyRotY, tgt.bodyRotY);
    cp.headRotY = lerp(cp.headRotY, tgt.headRotY);
    cp.leftArmRotX = lerp(cp.leftArmRotX, tgt.leftArmRotX);
    cp.leftArmRotZ = lerp(cp.leftArmRotZ, tgt.leftArmRotZ);
    cp.rightArmRotX = lerp(cp.rightArmRotX, tgt.rightArmRotX);
    cp.rightArmRotZ = lerp(cp.rightArmRotZ, tgt.rightArmRotZ);
    cp.leftForearmRotX = lerp(cp.leftForearmRotX, tgt.leftForearmRotX);
    cp.rightForearmRotX = lerp(cp.rightForearmRotX, tgt.rightForearmRotX);
    cp.leftLegRotX = lerp(cp.leftLegRotX, tgt.leftLegRotX);
    cp.rightLegRotX = lerp(cp.rightLegRotX, tgt.rightLegRotX);
    cp.leftFootRotZ = lerp(cp.leftFootRotZ, tgt.leftFootRotZ);
    cp.rightFootRotZ = lerp(cp.rightFootRotZ, tgt.rightFootRotZ);
    cp.leftLegSpread = lerp(cp.leftLegSpread, tgt.leftLegSpread);
    cp.rightLegSpread = lerp(cp.rightLegSpread, tgt.rightLegSpread);

    if (bodyRef.current) bodyRef.current.rotation.y = cp.bodyRotY;
    if (headRef.current) headRef.current.rotation.y = cp.headRotY;
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = cp.leftArmRotX;
      leftArmRef.current.rotation.z = cp.leftArmRotZ;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = cp.rightArmRotX;
      rightArmRef.current.rotation.z = cp.rightArmRotZ;
    }
    if (leftForearmRef.current) leftForearmRef.current.rotation.x = cp.leftForearmRotX;
    if (rightForearmRef.current) rightForearmRef.current.rotation.x = cp.rightForearmRotX;
    if (leftLegRef.current) {
      leftLegRef.current.rotation.x = cp.leftLegRotX;
      leftLegRef.current.rotation.z = cp.leftLegSpread;
    }
    if (rightLegRef.current) {
      rightLegRef.current.rotation.x = cp.rightLegRotX;
      rightLegRef.current.rotation.z = cp.rightLegSpread;
    }
    if (leftFootRef.current) leftFootRef.current.rotation.y = cp.leftFootRotZ;
    if (rightFootRef.current) rightFootRef.current.rotation.y = cp.rightFootRotZ;
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Full body group that rotates */}
      <group ref={bodyRef}>
        {/* Torso */}
        <mesh position={[0, 1.15, 0]}>
          <boxGeometry args={[0.55, 0.7, 0.3]} />
          <meshStandardMaterial color={OLIVE} />
        </mesh>

        {/* Belt */}
        <mesh position={[0, 0.82, 0]}>
          <boxGeometry args={[0.56, 0.07, 0.31]} />
          <meshStandardMaterial color={BELT} />
        </mesh>
        {/* Belt buckle */}
        <mesh position={[0, 0.82, 0.16]}>
          <boxGeometry args={[0.08, 0.06, 0.02]} />
          <meshStandardMaterial color="#c4a032" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Collar */}
        <mesh position={[0, 1.52, 0]}>
          <boxGeometry args={[0.4, 0.06, 0.25]} />
          <meshStandardMaterial color={OLIVE_DARK} />
        </mesh>

        {/* Epaulettes */}
        <mesh position={[-0.32, 1.48, 0]}>
          <boxGeometry args={[0.12, 0.04, 0.18]} />
          <meshStandardMaterial color={OLIVE_DARK} />
        </mesh>
        <mesh position={[0.32, 1.48, 0]}>
          <boxGeometry args={[0.12, 0.04, 0.18]} />
          <meshStandardMaterial color={OLIVE_DARK} />
        </mesh>

        {/* Neck */}
        <mesh position={[0, 1.58, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.1, 8]} />
          <meshStandardMaterial color={SKIN} />
        </mesh>

        {/* Head */}
        <group ref={headRef} position={[0, 1.78, 0]}>
          <mesh>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color={SKIN} />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.05, 0.02, 0.15]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          <mesh position={[0.05, 0.02, 0.15]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          {/* Nose */}
          <mesh position={[0, -0.01, 0.16]}>
            <boxGeometry args={[0.03, 0.04, 0.03]} />
            <meshStandardMaterial color={SKIN} />
          </mesh>
          {/* Beret */}
          <mesh position={[-0.04, 0.12, 0]}>
            <sphereGeometry args={[0.17, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={BERET} />
          </mesh>
          <mesh position={[0, 0.1, 0]} rotation={[0, 0, 0.1]}>
            <cylinderGeometry args={[0.17, 0.17, 0.04, 16]} />
            <meshStandardMaterial color={BERET} />
          </mesh>
          {/* Beret badge */}
          <mesh position={[0.08, 0.13, 0.12]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#c4a032" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>

        {/* LEFT ARM */}
        <group ref={leftArmRef} position={[-0.35, 1.42, 0]}>
          {/* Upper arm */}
          <mesh position={[0, -0.2, 0]}>
            <capsuleGeometry args={[0.065, 0.25, 8, 16]} />
            <meshStandardMaterial color={OLIVE} />
          </mesh>
          {/* Forearm */}
          <group ref={leftForearmRef} position={[0, -0.42, 0]}>
            <mesh position={[0, -0.17, 0]}>
              <capsuleGeometry args={[0.055, 0.22, 8, 16]} />
              <meshStandardMaterial color={OLIVE} />
            </mesh>
            {/* Hand */}
            <mesh position={[0, -0.35, 0]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial color={SKIN} />
            </mesh>
          </group>
        </group>

        {/* RIGHT ARM */}
        <group ref={rightArmRef} position={[0.35, 1.42, 0]}>
          {/* Upper arm */}
          <mesh position={[0, -0.2, 0]}>
            <capsuleGeometry args={[0.065, 0.25, 8, 16]} />
            <meshStandardMaterial color={OLIVE} />
          </mesh>
          {/* Forearm */}
          <group ref={rightForearmRef} position={[0, -0.42, 0]}>
            <mesh position={[0, -0.17, 0]}>
              <capsuleGeometry args={[0.055, 0.22, 8, 16]} />
              <meshStandardMaterial color={OLIVE} />
            </mesh>
            {/* Hand */}
            <mesh position={[0, -0.35, 0]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial color={SKIN} />
            </mesh>
          </group>
        </group>

        {/* Hips */}
        <mesh position={[0, 0.78, 0]}>
          <boxGeometry args={[0.45, 0.12, 0.28]} />
          <meshStandardMaterial color={OLIVE_DARK} />
        </mesh>

        {/* LEFT LEG */}
        <group ref={leftLegRef} position={[-0.12, 0.72, 0]}>
          {/* Thigh */}
          <mesh position={[0, -0.22, 0]}>
            <capsuleGeometry args={[0.075, 0.28, 8, 16]} />
            <meshStandardMaterial color={OLIVE_DARK} />
          </mesh>
          {/* Shin */}
          <mesh position={[0, -0.55, 0]}>
            <capsuleGeometry args={[0.065, 0.3, 8, 16]} />
            <meshStandardMaterial color={OLIVE_DARK} />
          </mesh>
          {/* Boot */}
          <group ref={leftFootRef} position={[0, -0.78, 0]}>
            <mesh position={[0, -0.04, 0.04]}>
              <boxGeometry args={[0.14, 0.12, 0.22]} />
              <meshStandardMaterial color={BOOT} />
            </mesh>
          </group>
        </group>

        {/* RIGHT LEG */}
        <group ref={rightLegRef} position={[0.12, 0.72, 0]}>
          {/* Thigh */}
          <mesh position={[0, -0.22, 0]}>
            <capsuleGeometry args={[0.075, 0.28, 8, 16]} />
            <meshStandardMaterial color={OLIVE_DARK} />
          </mesh>
          {/* Shin */}
          <mesh position={[0, -0.55, 0]}>
            <capsuleGeometry args={[0.065, 0.3, 8, 16]} />
            <meshStandardMaterial color={OLIVE_DARK} />
          </mesh>
          {/* Boot */}
          <group ref={rightFootRef} position={[0, -0.78, 0]}>
            <mesh position={[0, -0.04, 0.04]}>
              <boxGeometry args={[0.14, 0.12, 0.22]} />
              <meshStandardMaterial color={BOOT} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

function Scene({ pose }: { pose: DrillPosition }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 3]} intensity={1} castShadow />
      <directionalLight position={[-2, 3, -1]} intensity={0.3} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.25, 0]} receiveShadow>
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial color="#e8e8e8" />
      </mesh>

      {/* Direction indicator - front arrow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.24, 1.2]}>
        <coneGeometry args={[0.08, 0.15, 3]} />
        <meshStandardMaterial color={OLIVE} opacity={0.5} transparent />
      </mesh>

      <SoldierModel pose={pose} isMarchCycle={false} />

      <OrbitControls
        enablePan={false}
        minDistance={2}
        maxDistance={5}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 2 - 0.1}
        target={[0, 0.8, 0]}
      />
    </>
  );
}

const DrillFigure3D = () => {
  const { lang } = useI18n();
  const [currentPose, setCurrentPose] = useState<DrillPosition>('firmes');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const labels: Record<DrillPosition, { es: string; en: string }> = {
    firmes: { es: '¡Atención... Fir!', en: 'Attention!' },
    descanso: { es: '¡A dis... cansó!', en: 'At ease!' },
    flancoDerecho: { es: '¡Flanco derecho... Der!', en: 'Right face!' },
    flancoIzquierdo: { es: '¡Flanco izquierdo... Izq!', en: 'Left face!' },
    mediaVuelta: { es: '¡Media vuelta... Ar!', en: 'About face!' },
    marcha: { es: '¡De frente... Mar!', en: 'Forward march!' },
    saludo: { es: '¡Saludo!', en: 'Salute!' },
  };

  const descriptions: Record<DrillPosition, { es: string; en: string }> = {
    firmes: {
      es: 'Talones unidos formando ángulo de 45°, cuerpo erguido, pecho afuera, brazos a los costados con manos semicerradas, vista al frente y mentón recogido.',
      en: 'Heels together forming a 45° angle, body erect, chest out, arms at sides with semi-closed hands, eyes front and chin tucked.',
    },
    descanso: {
      es: 'Pie izquierdo se separa al ancho de los hombros, manos se cruzan detrás de la espalda. Posición relajada pero atenta.',
      en: 'Left foot moves shoulder-width apart, hands crossed behind back. Relaxed but alert position.',
    },
    flancoDerecho: {
      es: 'Giro de 90° a la derecha. Se ejecuta sobre el talón del pie derecho y la punta del pie izquierdo. El cuerpo gira como una unidad.',
      en: '90° turn to the right. Executed on the right heel and left toe. The body turns as a unit.',
    },
    flancoIzquierdo: {
      es: 'Giro de 90° a la izquierda. Se ejecuta sobre el talón del pie izquierdo y la punta del pie derecho. El cuerpo gira como una unidad.',
      en: '90° turn to the left. Executed on the left heel and right toe. The body turns as a unit.',
    },
    mediaVuelta: {
      es: 'Giro de 180° sobre el talón del pie derecho y la punta del pie izquierdo. El cuerpo realiza un giro completo hacia atrás.',
      en: '180° turn on the right heel and left toe. The body performs a full turn to the rear.',
    },
    marcha: {
      es: 'Se inicia con el pie izquierdo. Los brazos oscilan naturalmente, el izquierdo al frente y el derecho atrás, alternando con cada paso.',
      en: 'Begins with the left foot. Arms swing naturally, left forward and right back, alternating with each step.',
    },
    saludo: {
      es: 'La mano derecha sube con los dedos extendidos y juntos hasta tocar el borde de la boina. El brazo forma un ángulo de 45°.',
      en: 'The right hand rises with extended, joined fingers to touch the beret edge. The arm forms a 45° angle.',
    },
  };

  // Auto-play
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = (prev + 1) % drillSequence.length;
        setCurrentPose(drillSequence[next]);
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const goTo = (step: number) => {
    setCurrentStep(step);
    setCurrentPose(drillSequence[step]);
  };

  const shortLabel = (pos: DrillPosition) => {
    const map: Record<DrillPosition, { es: string; en: string }> = {
      firmes: { es: 'Firmes', en: 'Attention' },
      descanso: { es: 'Descanso', en: 'At Ease' },
      flancoDerecho: { es: 'F. Der.', en: 'R. Face' },
      flancoIzquierdo: { es: 'F. Izq.', en: 'L. Face' },
      mediaVuelta: { es: 'M. Vuelta', en: 'About' },
      marcha: { es: 'Marcha', en: 'March' },
      saludo: { es: 'Saludo', en: 'Salute' },
    };
    return map[pos][lang];
  };

  return (
    <div className="border-2 border-military-green bg-military-green/5 p-4 md:p-6 my-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-military-green animate-pulse" />
        <p className="text-military-label text-military-green">
          {lang === 'es' ? 'Asistente Visual 3D de Movimientos' : '3D Visual Movement Assistant'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 3D Canvas */}
        <div className="w-full lg:w-1/2 aspect-square max-h-[400px] bg-gradient-to-b from-muted/30 to-muted/60 border border-border rounded-sm overflow-hidden">
          <Canvas
            camera={{ position: [0, 1.5, 3], fov: 40 }}
            shadows
            gl={{ antialias: true }}
          >
            <Scene pose={currentPose} />
          </Canvas>
        </div>

        {/* Controls & Info */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Current command */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPose}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="mb-4"
              >
                <p className="text-lg md:text-xl font-black tracking-wide text-military-green">
                  {labels[currentPose][lang]}
                </p>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {descriptions[currentPose][lang]}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Orbit hint */}
            <p className="text-xs text-muted-foreground/60 mb-4 italic">
              {lang === 'es' 
                ? '🖱️ Arrastra para rotar • Scroll para zoom' 
                : '🖱️ Drag to rotate • Scroll to zoom'}
            </p>
          </div>

          {/* Position selector */}
          <div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {drillSequence.map((pos, i) => (
                <button
                  key={pos}
                  onClick={() => { goTo(i); setIsPlaying(false); }}
                  className={`px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider border-2 transition-colors ${
                    currentStep === i
                      ? 'bg-military-green text-white border-military-green'
                      : 'border-foreground/20 text-muted-foreground hover:border-foreground/40'
                  }`}
                >
                  {shortLabel(pos)}
                </button>
              ))}
            </div>

            {/* Playback controls */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="rounded-none border-2"
                onClick={() => { goTo(Math.max(0, currentStep - 1)); setIsPlaying(false); }}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                className="rounded-none bg-military-green hover:bg-military-green/90 text-white border-0"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-none border-2"
                onClick={() => { goTo(Math.min(drillSequence.length - 1, currentStep + 1)); setIsPlaying(false); }}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-none border-2"
                onClick={() => { goTo(0); setIsPlaying(false); }}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground ml-2 font-mono">
                {currentStep + 1}/{drillSequence.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrillFigure3D;
