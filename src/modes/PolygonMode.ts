import type { ModeController } from './ModeController';
import type { Coords, Shape } from '../types';
import { useEditorStore } from '../store/editorStore';
import { AddShapeCommand } from '../history/commands';

export class PolygonMode implements ModeController {
  onCanvasClick(point: Coords, _hitShape: Shape | null): void {
    useEditorStore.getState().addPendingVertex(point);
  }

  onCanvasMouseDown(): void {
  }
  onCanvasMouseMove(): void {}
  onCanvasMouseUp(): void {}
  
  getCursor(): string {
    return 'crosshair';
  }

  complete(): boolean {
    const { pendingVertices, historyManager, clearPending } =
      useEditorStore.getState();
    if (pendingVertices.length < 3) return false;

    const shape = {
      type: 'polygon' as const,
      id: crypto.randomUUID(),
      vertices: [...pendingVertices],
    };
    historyManager.execute(new AddShapeCommand(shape));
    clearPending();
    return true;
  }
}
