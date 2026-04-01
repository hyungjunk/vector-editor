import { create } from 'zustand';
import type { Shape, EditorMode, Coords } from '../types';
import { HistoryManager } from '../history/historyManager';

export interface EditorState {
  shapes: Shape[];
  currentMode: EditorMode;
  pendingVertices: Coords[];
  historyManager: HistoryManager;

  addShape: (shape: Shape) => void;
  removeShape: (id: string) => void;
  updateShape: (id: string, updated: Shape) => void;
  setMode: (mode: EditorMode) => void;
  addPendingVertex: (vertex: Coords) => void;
  clearPending: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  shapes: [],
  currentMode: 'point',
  pendingVertices: [],
  historyManager: new HistoryManager(),

  addShape: (shape) =>
    set((state) => ({ shapes: [...state.shapes, shape] })),

  removeShape: (id) =>
    set((state) => ({ shapes: state.shapes.filter((s) => s.id !== id) })),

  updateShape: (id, updated) =>
    set((state) => ({
      shapes: state.shapes.map((s) => (s.id === id ? updated : s)),
    })),

  setMode: (mode) =>
    set({ currentMode: mode, pendingVertices: [] }),

  addPendingVertex: (vertex) =>
    set((state) => ({
      pendingVertices: [...state.pendingVertices, vertex],
    })),

  clearPending: () => set({ pendingVertices: [] }),
}));
