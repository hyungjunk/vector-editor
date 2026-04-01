import type { ModeController } from './ModeController';
import type { Coords, Shape } from '../types';
import { useEditorStore } from '../store/editorStore';
import { MoveShapeCommand } from '../history/commands';
import { offsetShape } from '../utils/geometry';

export class MoveMode implements ModeController {
  private dragging = false;
  private dragShapeId: string | null = null;
  private dragStart: Coords | null = null;
  private originalShape: Shape | null = null;

  onCanvasClick(): void {}

  onCanvasMouseDown(point: Coords, hitShape: Shape | null): void {
    if (!hitShape) return;
    this.dragging = true;
    this.dragShapeId = hitShape.id;
    this.dragStart = point;
    this.originalShape = structuredClone(hitShape);
  }

  onCanvasMouseMove(point: Coords): void {
    if (!this.dragging || !this.dragStart || !this.dragShapeId || !this.originalShape)
      return;

    const dx = point.x - this.dragStart.x;
    const dy = point.y - this.dragStart.y;
    const moved = offsetShape(this.originalShape, dx, dy);
    useEditorStore.getState().updateShape(this.dragShapeId, moved);
  }

  onCanvasMouseUp(point: Coords): void {
    console.log('asdf')
    if (!this.dragging || !this.dragStart || !this.dragShapeId || !this.originalShape)
      return;

    const dx = point.x - this.dragStart.x;
    const dy = point.y - this.dragStart.y;

    if (dx !== 0 || dy !== 0) {
      const after = offsetShape(this.originalShape, dx, dy);
      // Restore the original first so the command's execute() applies the move
      useEditorStore.getState().updateShape(this.dragShapeId, this.originalShape);
      const { historyManager } = useEditorStore.getState();
      historyManager.execute(
        new MoveShapeCommand(this.dragShapeId, this.originalShape, after)
      );
    }

    this.reset();
  }

  getCursor(): string {
    return this.dragging ? 'grabbing' : 'grab';
  }

  private reset(): void {
    this.dragging = false;
    this.dragShapeId = null;
    this.dragStart = null;
    this.originalShape = null;
  }
}
