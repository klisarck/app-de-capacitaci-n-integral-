// src/lib/validation.ts
export const validateStudentData = (data: { id: string, name: string }) => {
  try {
    if (!data.id || data.id.length < 3) return false;
    if (!data.name || data.name.trim() === "") return false;
    return true;
  } catch (error) {
    console.error(`[ERROR] [${new Date().toISOString()}]: Validación fallida -`, error);
    return false;
  }
};