import type { Coords, Shape } from '../types';

export interface ModeController {
  onCanvasClick(point: Coords, hitShape: Shape | null): void;
  onCanvasMouseDown(point: Coords, hitShape: Shape | null): void;
  onCanvasMouseMove(point: Coords): void;
  onCanvasMouseUp(point: Coords): void;
  getCursor(): string;
}
