import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from '../src/store/editorStore';
import { HistoryManager } from '../src/history/historyManager';
import { PointMode } from '../src/modes/PointMode';
import { PolygonMode } from '../src/modes/PolygonMode';
import { MoveMode } from '../src/modes/MoveMode';
import { DeleteMode } from '../src/modes/DeleteMode';
import type { PointShape } from '../src/types';

beforeEach(() => {
  useEditorStore.setState({
    shapes: [],
    pendingVertices: [],
    historyManager: new HistoryManager(),
  });
});

describe('PointMode', () => {
  it('creates a point on click', () => {
    const mode = new PointMode();
    mode.onCanvasClick({ x: 100, y: 200 }, null);
    const shapes = useEditorStore.getState().shapes;
    expect(shapes).toHaveLength(1);
    expect(shapes[0].type).toBe('point');
    if (shapes[0].type === 'point') {
      expect(shapes[0].x).toBe(100);
      expect(shapes[0].y).toBe(200);
    }
  });

  it('creates multiple points', () => {
    const mode = new PointMode();
    mode.onCanvasClick({ x: 10, y: 20 }, null);
    mode.onCanvasClick({ x: 30, y: 40 }, null);
    expect(useEditorStore.getState().shapes).toHaveLength(2);
  });
});

describe('PolygonMode', () => {
  it('adds pending vertices on click', () => {
    const mode = new PolygonMode();
    mode.onCanvasClick({ x: 10, y: 20 }, null);
    mode.onCanvasClick({ x: 30, y: 40 }, null);
    expect(useEditorStore.getState().pendingVertices).toHaveLength(2);
    expect(useEditorStore.getState().shapes).toHaveLength(0);
  });

  it('complete() creates a polygon from 3+ vertices', () => {
    const mode = new PolygonMode();
    mode.onCanvasClick({ x: 0, y: 0 }, null);
    mode.onCanvasClick({ x: 10, y: 0 }, null);
    mode.onCanvasClick({ x: 10, y: 10 }, null);

    const result = mode.complete();
    expect(result).toBe(true);

    const shapes = useEditorStore.getState().shapes;
    expect(shapes).toHaveLength(1);
    expect(shapes[0].type).toBe('polygon');
    expect(useEditorStore.getState().pendingVertices).toHaveLength(0);
  });

  it('complete() fails with fewer than 3 vertices', () => {
    const mode = new PolygonMode();
    mode.onCanvasClick({ x: 0, y: 0 }, null);
    mode.onCanvasClick({ x: 10, y: 0 }, null);

    const result = mode.complete();
    expect(result).toBe(false);
    expect(useEditorStore.getState().shapes).toHaveLength(0);
  });
});

describe('MoveMode', () => {
  it('moves a shape via drag', () => {
    const point: PointShape = { type: 'point', id: 'p1', x: 100, y: 100 };
    useEditorStore.setState({ shapes: [point] });

    const mode = new MoveMode();
    mode.onCanvasMouseDown({ x: 100, y: 100 }, point);
    mode.onCanvasMouseMove({ x: 150, y: 120 });
    mode.onCanvasMouseUp({ x: 150, y: 120 });

    const moved = useEditorStore.getState().shapes[0] as PointShape;
    expect(moved.x).toBe(150);
    expect(moved.y).toBe(120);
  });

  it('does not create a command if no movement', () => {
    const point: PointShape = { type: 'point', id: 'p1', x: 100, y: 100 };
    useEditorStore.setState({ shapes: [point] });

    const mode = new MoveMode();
    mode.onCanvasMouseDown({ x: 100, y: 100 }, point);
    mode.onCanvasMouseUp({ x: 100, y: 100 });

    expect(useEditorStore.getState().historyManager.canUndo).toBe(false);
  });

  it('movement is undoable', () => {
    const point: PointShape = { type: 'point', id: 'p1', x: 100, y: 100 };
    useEditorStore.setState({ shapes: [point] });

    const mode = new MoveMode();
    mode.onCanvasMouseDown({ x: 100, y: 100 }, point);
    mode.onCanvasMouseMove({ x: 200, y: 200 });
    mode.onCanvasMouseUp({ x: 200, y: 200 });

    useEditorStore.getState().historyManager.undo();
    const restored = useEditorStore.getState().shapes[0] as PointShape;
    expect(restored.x).toBe(100);
    expect(restored.y).toBe(100);
  });
});

describe('DeleteMode', () => {
  it('deletes a shape on click', () => {
    const point: PointShape = { type: 'point', id: 'p1', x: 100, y: 100 };
    useEditorStore.setState({ shapes: [point] });

    const mode = new DeleteMode();
    mode.onCanvasClick({ x: 100, y: 100 }, point);
    expect(useEditorStore.getState().shapes).toHaveLength(0);
  });

  it('does nothing when clicking empty space', () => {
    const point: PointShape = { type: 'point', id: 'p1', x: 100, y: 100 };
    useEditorStore.setState({ shapes: [point] });

    const mode = new DeleteMode();
    mode.onCanvasClick({ x: 200, y: 200 }, null);
    expect(useEditorStore.getState().shapes).toHaveLength(1);
  });

  it('deletion is undoable', () => {
    const point: PointShape = { type: 'point', id: 'p1', x: 100, y: 100 };
    useEditorStore.setState({ shapes: [point] });

    const mode = new DeleteMode();
    mode.onCanvasClick({ x: 100, y: 100 }, point);
    expect(useEditorStore.getState().shapes).toHaveLength(0);

    useEditorStore.getState().historyManager.undo();
    expect(useEditorStore.getState().shapes).toHaveLength(1);
    expect(useEditorStore.getState().shapes[0]).toEqual(point);
  });
});
