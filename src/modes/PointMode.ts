import type { ModeController } from './ModeController';
import type { Coords, Shape } from '../types';
import { useEditorStore } from '../store/editorStore';
import { AddShapeCommand } from '../history/commands';

export class PointMode implements ModeController {
  onCanvasClick(point: Coords, _hitShape: Shape | null): void {
    const { historyManager } = useEditorStore.getState();
    const shape = {
      type: 'point' as const,
      id: crypto.randomUUID(),
      x: point.x,
      y: point.y,
    };
    historyManager.execute(new AddShapeCommand(shape));
  }

  onCanvasMouseDown(): void {}
  onCanvasMouseMove(): void {}
  onCanvasMouseUp(): void {}

  getCursor(): string {
    return 'crosshair';
  }
}
