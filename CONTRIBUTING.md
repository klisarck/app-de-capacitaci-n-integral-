# Guía de Contribución - Plan de Estudios de Cadetes

Este documento establece las normas obligatorias para la integración de artefactos de ingeniería en el repositorio.

## Estructura de Git Flow (Ramas de Trabajo)
Para mantener un desarrollo limpio, las ramas se nombrarán siguiendo esta nomenclatura:
- `feature/modulo-[nombre]`: Para el desarrollo de nuevos módulos de la plataforma (ej: `feature/modulo-estudios`).
- `fix/[descripcion]`: Para la corrección de errores en tipos o interfaces de TypeScript (ej: `fix/error-supabase`).
- `docs/[tema]`: Actualizaciones del manual técnico o diagramas.

## Historial de Cambios y Conventional Commits
Se exige el uso estricto de mensajes estructurados en los commits para la bitácora automática:
- `feat:` Introducción de nuevas vistas, componentes React o lógica (ej: `feat: agregar tabla de calificaciones`).
- `fix:` Corrección de bugs o tipados incorrectos en TypeScript (ej: `fix: tipado de interfaz del cadete`).
- `docs:` Modificaciones en el README o documentación de arquitectura.
- `chore:` Actualización de dependencias de Bun o configuraciones de Vite.
