import type { ModeController } from './ModeController';
import type { Coords, Shape } from '../types';
import { useEditorStore } from '../store/editorStore';
import { DeleteShapeCommand } from '../history/commands';

export class DeleteMode implements ModeController {
  onCanvasClick(_point: Coords, hitShape: Shape | null): void {
    if (!hitShape) return;
    const { historyManager } = useEditorStore.getState();
    historyManager.execute(new DeleteShapeCommand(hitShape));
  }

  onCanvasMouseDown(): void {}
  onCanvasMouseMove(): void {}
  onCanvasMouseUp(): void {}

  getCursor(): string {
    return 'not-allowed';
  }
}
