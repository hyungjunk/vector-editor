import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from '../src/store/editorStore';
import {
  AddShapeCommand,
  DeleteShapeCommand,
  MoveShapeCommand,
} from '../src/history/commands';
import type { PointShape, PolygonShape } from '../src/types';

beforeEach(() => {
  useEditorStore.setState({ shapes: [], pendingVertices: [] });
});

describe('AddShapeCommand', () => {
  it('adds a shape on execute', () => {
    const point: PointShape = { type: 'point', id: 'p1', x: 10, y: 20 };
    const cmd = new AddShapeCommand(point);
    cmd.execute();
    expect(useEditorStore.getState().shapes).toHaveLength(1);
    expect(useEditorStore.getState().shapes[0]).toEqual(point);
  });

  it('removes the shape on undo', () => {
    const point: PointShape = { type: 'point', id: 'p1', x: 10, y: 20 };
    const cmd = new AddShapeCommand(point);
    cmd.execute();
    cmd.undo();
    expect(useEditorStore.getState().shapes).toHaveLength(0);
  });

  it('does not mutate the original shape', () => {
    const point: PointShape = { type: 'point', id: 'p1', x: 10, y: 20 };
    const cmd = new AddShapeCommand(point);
    cmd.execute();
    // Mutate the store copy
    const storeShape = useEditorStore.getState().shapes[0] as PointShape;
    storeShape.x = 999;
    // Undo should restore original
    cmd.undo();
    cmd.execute();
    expect((useEditorStore.getState().shapes[0] as PointShape).x).toBe(10);
  });
});

describe('DeleteShapeCommand', () => {
  it('removes a shape on execute', () => {
    const point: PointShape = { type: 'point', id: 'p1', x: 10, y: 20 };
    useEditorStore.setState({ shapes: [point] });

    const cmd = new DeleteShapeCommand(point);
    cmd.execute();
    expect(useEditorStore.getState().shapes).toHaveLength(0);
  });

  it('restores the shape on undo', () => {
    const point: PointShape = { type: 'point', id: 'p1', x: 10, y: 20 };
    useEditorStore.setState({ shapes: [point] });

    const cmd = new DeleteShapeCommand(point);
    cmd.execute();
    cmd.undo();
    expect(useEditorStore.getState().shapes).toHaveLength(1);
    expect(useEditorStore.getState().shapes[0]).toEqual(point);
  });
});

describe('MoveShapeCommand', () => {
  it('applies the after state on execute', () => {
    const before: PointShape = { type: 'point', id: 'p1', x: 10, y: 20 };
    const after: PointShape = { type: 'point', id: 'p1', x: 50, y: 60 };
    useEditorStore.setState({ shapes: [before] });

    const cmd = new MoveShapeCommand('p1', before, after);
    cmd.execute();
    expect(useEditorStore.getState().shapes[0]).toEqual(after);
  });

  it('restores the before state on undo', () => {
    const before: PointShape = { type: 'point', id: 'p1', x: 10, y: 20 };
    const after: PointShape = { type: 'point', id: 'p1', x: 50, y: 60 };
    useEditorStore.setState({ shapes: [{ ...after }] });

    const cmd = new MoveShapeCommand('p1', before, after);
    cmd.execute();
    cmd.undo();
    expect(useEditorStore.getState().shapes[0]).toEqual(before);
  });

  it('works with polygon shapes', () => {
    const before: PolygonShape = {
      type: 'polygon',
      id: 'pg1',
      vertices: [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 10 },
      ],
    };
    const after: PolygonShape = {
      type: 'polygon',
      id: 'pg1',
      vertices: [
        { x: 5, y: 5 },
        { x: 15, y: 5 },
        { x: 15, y: 15 },
      ],
    };
    useEditorStore.setState({ shapes: [before] });

    const cmd = new MoveShapeCommand('pg1', before, after);
    cmd.execute();
    expect(useEditorStore.getState().shapes[0]).toEqual(after);
    cmd.undo();
    expect(useEditorStore.getState().shapes[0]).toEqual(before);
  });
});
