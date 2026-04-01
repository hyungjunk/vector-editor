export interface Coords {
  x: number;
  y: number;
}

export interface PointShape {
  type: 'point';
  id: string;
  x: number;
  y: number;
}

export interface PolygonShape {
  type: 'polygon';
  id: string;
  vertices: Coords[];
}

export type Shape = PointShape | PolygonShape;

export type EditorMode = 'point' | 'polygon' | 'move' | 'delete';

export interface Command {
  execute(): void;
  undo(): void;
}
