import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from '../src/store/editorStore';
import type { PointShape, PolygonShape } from '../src/types';

beforeEach(() => {
  useEditorStore.setState({
    shapes: [],
    currentMode: 'point',
    pendingVertices: [],
  });
});

describe('editorStore', () => {
  describe('shapes CRUD', () => {
    it('addShape appends a shape', () => {
      const point: PointShape = { type: 'point', id: 'p1', x: 10, y: 20 };
      useEditorStore.getState().addShape(point);
      expect(useEditorStore.getState().shapes).toEqual([point]);
    });

    it('removeShape removes by id', () => {
      const p1: PointShape = { type: 'point', id: 'p1', x: 10, y: 20 };
      const p2: PointShape = { type: 'point', id: 'p2', x: 30, y: 40 };
      useEditorStore.setState({ shapes: [p1, p2] });

      useEditorStore.getState().removeShape('p1');
      expect(useEditorStore.getState().shapes).toEqual([p2]);
    });

    it('updateShape replaces the shape with matching id', () => {
      const p1: PointShape = { type: 'point', id: 'p1', x: 10, y: 20 };
      useEditorStore.setState({ shapes: [p1] });

      const updated: PointShape = { type: 'point', id: 'p1', x: 50, y: 60 };
      useEditorStore.getState().updateShape('p1', updated);
      expect(useEditorStore.getState().shapes[0]).toEqual(updated);
    });

    it('updateShape does not affect other shapes', () => {
      const p1: PointShape = { type: 'point', id: 'p1', x: 10, y: 20 };
      const p2: PointShape = { type: 'point', id: 'p2', x: 30, y: 40 };
      useEditorStore.setState({ shapes: [p1, p2] });

      const updated: PointShape = { type: 'point', id: 'p1', x: 99, y: 99 };
      useEditorStore.getState().updateShape('p1', updated);
      expect(useEditorStore.getState().shapes[1]).toEqual(p2);
    });
  });

  describe('mode management', () => {
    it('setMode changes the current mode', () => {
      useEditorStore.getState().setMode('polygon');
      expect(useEditorStore.getState().currentMode).toBe('polygon');
    });

    it('setMode clears pending vertices', () => {
      useEditorStore.setState({
        pendingVertices: [{ x: 1, y: 2 }],
        currentMode: 'polygon',
      });
      useEditorStore.getState().setMode('point');
      expect(useEditorStore.getState().pendingVertices).toEqual([]);
    });
  });

  describe('pending vertices', () => {
    it('addPendingVertex appends a vertex', () => {
      useEditorStore.getState().addPendingVertex({ x: 10, y: 20 });
      useEditorStore.getState().addPendingVertex({ x: 30, y: 40 });
      expect(useEditorStore.getState().pendingVertices).toEqual([
        { x: 10, y: 20 },
        { x: 30, y: 40 },
      ]);
    });

    it('clearPending removes all pending vertices', () => {
      useEditorStore.setState({
        pendingVertices: [
          { x: 1, y: 2 },
          { x: 3, y: 4 },
        ],
      });
      useEditorStore.getState().clearPending();
      expect(useEditorStore.getState().pendingVertices).toEqual([]);
    });
  });
});
