import type { Coords, Shape } from '../types';

export function distance(a: Coords, b: Coords): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function centroid(vertices: Coords[]): Coords {
  const sum = vertices.reduce(
    (acc, v) => ({ x: acc.x + v.x, y: acc.y + v.y }),
    { x: 0, y: 0 }
  );
  return { x: sum.x / vertices.length, y: sum.y / vertices.length };
}

export function offsetShape(shape: Shape, dx: number, dy: number): Shape {
  if (shape.type === 'point') {
    return { ...shape, x: shape.x + dx, y: shape.y + dy };
  }
  return {
    ...shape,
    vertices: shape.vertices.map((v) => ({ x: v.x + dx, y: v.y + dy })),
  };
}
