// src/services/evaluacionService.ts

export interface RespuestaUsuario {
  id: string;
  respuesta: string;
}

interface PreguntaGabarito {
  id: string;
  respuestaCorrecta: string;
}

// Estructura de gabaritos almacenada en memoria para acceso rápido
const gabaritos: Record<string, PreguntaGabarito[]> = {
  examen1: [
    { id: 'p1', respuestaCorrecta: 'A' },
    { id: 'p2', respuestaCorrecta: 'B' },
    { id: 'p3', respuestaCorrecta: 'C' },
  ],
  examen2: [
    { id: 'p1', respuestaCorrecta: 'Verdadero' },
    { id: 'p2', respuestaCorrecta: 'Falso' },
  ],
};

/**
 * Evalúa el examen comparando respuestas en memoria.
 * Evita consultas a la base de datos (N+1 queries) optimizando el rendimiento.
 */
export const evaluarExamen = (
  examenId: string,
  respuestasUsuario: RespuestaUsuario[]
) => {
  const gabarito = gabaritos[examenId];
  
  // Validación de seguridad y robustez
  if (!gabarito) {
    throw new Error(`Examen con ID ${examenId} no encontrado.`);
  }

  // Convertimos el gabarito a un Map para una búsqueda de tiempo constante O(1)
  const gabaritoMap = new Map(gabarito.map((item) => [item.id, item.respuestaCorrecta]));

  let puntaje = 0;

  for (const respuesta of respuestasUsuario) {
    const correcta = gabaritoMap.get(respuesta.id);
    if (correcta !== undefined && correcta === respuesta.respuesta) {
      puntaje += 1;
    }
  }

  // Retornamos un objeto completo para que el Frontend procese la información
  return {
    puntajeObtenido: puntaje,
    totalPreguntas: gabarito.length,
    porcentaje: (puntaje / gabarito.length) * 100,
    aprobado: puntaje >= (gabarito.length * 0.6) // Supone 60% para aprobar
  };
};
