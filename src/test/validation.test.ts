// src/test/validation.test.ts
import { describe, test, expect } from 'vitest';
import { validateStudentData } from '../lib/validation';
import { evaluarExamen } from '../services/evaluacionService';

// --- TUS PRUEBAS ACTUALES ---
describe('Validaciones del Sistema UNEFA CP', () => {
  test('ID válido debe retornar true', () => {
    expect(validateStudentData({ id: '12345', name: 'Luis' })).toBe(true);
  });
  test('Nombre vacío debe retornar false', () => {
    expect(validateStudentData({ id: '12345', name: '' })).toBe(false);
  });
  test('ID menor a 3 caracteres debe retornar false', () => {
    expect(validateStudentData({ id: '12', name: 'Luis' })).toBe(false);
  });
  test('Datos nulos deben retornar false', () => {
   expect(validateStudentData(null as any)).toBe(false);
  });
  test('Caracteres especiales deben ser manejados', () => {
    expect(validateStudentData({ id: 'ABC!@#', name: 'Luis' })).toBe(true);
  });
});

// --- TUS NUEVAS PRUEBAS DE LÓGICA (EVALUACIÓN POR CAPAS) ---
describe('Lógica de Evaluación (Servicio de Evaluaciones)', () => {
  
  test('debe calcular correctamente el puntaje del examen1', () => {
    const respuestas = [
      { id: 'p1', respuesta: 'A' },
      { id: 'p2', respuesta: 'B' },
      { id: 'p3', respuesta: 'D' } // Incorrecta
    ];
    
    const resultado = evaluarExamen('examen1', respuestas);
    
    // Debería tener 2 aciertos de 3
    expect(resultado.puntajeObtenido).toBe(2);
    expect(resultado.totalPreguntas).toBe(3);
    expect(resultado.porcentaje).toBe(66.66666666666666);
  });

  test('debe lanzar error si el ID del examen no existe en el sistema', () => {
    expect(() => evaluarExamen('examen_inexistente', [])).toThrow();
  });
});