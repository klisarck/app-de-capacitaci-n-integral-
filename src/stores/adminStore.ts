import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Course, Module, Lesson, InteractiveElement } from '@/data/courses';
import type { Simulation, SimulationNode } from '@/data/simulations';

interface AdminState {
  isTeacher: boolean;
  setIsTeacher: (val: boolean) => void;
  customCourses: Course[];
  customSimulations: Simulation[];
  addCourse: (course: Course) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addSimulation: (sim: Simulation) => void;
  updateSimulation: (id: string, sim: Partial<Simulation>) => void;
  deleteSimulation: (id: string) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isTeacher: false,
      setIsTeacher: (val) => set({ isTeacher: val }),
      customCourses: [],
      customSimulations: [],
      addCourse: (course) => set((s) => ({ customCourses: [...s.customCourses, course] })),
      updateCourse: (id, data) => set((s) => ({
        customCourses: s.customCourses.map((c) => c.id === id ? { ...c, ...data } : c),
      })),
      deleteCourse: (id) => set((s) => ({
        customCourses: s.customCourses.filter((c) => c.id !== id),
      })),
      addSimulation: (sim) => set((s) => ({ customSimulations: [...s.customSimulations, sim] })),
      updateSimulation: (id, data) => set((s) => ({
        customSimulations: s.customSimulations.map((sim) => sim.id === id ? { ...sim, ...data } : sim),
      })),
      deleteSimulation: (id) => set((s) => ({
        customSimulations: s.customSimulations.filter((sim) => sim.id !== id),
      })),
    }),
    { name: 'admin-store' }
  )
);
