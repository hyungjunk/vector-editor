import { describe, it, expect } from 'vitest';
import { distance, centroid, offsetShape } from '../src/utils/geometry';
import type { PointShape, PolygonShape } from '../src/types';

describe('distance', () => {
  it('returns 0 for the same point', () => {
    expect(distance({ x: 5, y: 5 }, { x: 5, y: 5 })).toBe(0);
  });

  it('calculates distance between two points', () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });

  it('handles negative coordinates', () => {
    expect(distance({ x: -1, y: -1 }, { x: 2, y: 3 })).toBe(5);
  });
});

describe('centroid', () => {
  it('returns the single point for one vertex', () => {
    expect(centroid([{ x: 10, y: 20 }])).toEqual({ x: 10, y: 20 });
  });

  it('returns midpoint for two vertices', () => {
    expect(centroid([{ x: 0, y: 0 }, { x: 10, y: 10 }])).toEqual({
      x: 5,
      y: 5,
    });
  });

  it('calculates centroid of a triangle', () => {
    const result = centroid([
      { x: 0, y: 0 },
      { x: 6, y: 0 },
      { x: 3, y: 6 },
    ]);
    expect(result.x).toBe(3);
    expect(result.y).toBe(2);
  });
});

describe('offsetShape', () => {
  it('offsets a point shape', () => {
    const point: PointShape = { type: 'point', id: 'p1', x: 10, y: 20 };
    const result = offsetShape(point, 5, -3);
    expect(result).toEqual({ type: 'point', id: 'p1', x: 15, y: 17 });
  });

  it('offsets a polygon shape', () => {
    const polygon: PolygonShape = {
      type: 'polygon',
      id: 'pg1',
      vertices: [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 10 },
      ],
    };
    const result = offsetShape(polygon, 5, 5);
    expect(result).toEqual({
      type: 'polygon',
      id: 'pg1',
      vertices: [
        { x: 5, y: 5 },
        { x: 15, y: 5 },
        { x: 15, y: 15 },
      ],
    });
  });

  it('does not mutate the original shape', () => {
    const point: PointShape = { type: 'point', id: 'p1', x: 10, y: 20 };
    offsetShape(point, 5, 5);
    expect(point.x).toBe(10);
    expect(point.y).toBe(20);
  });
});
