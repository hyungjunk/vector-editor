import type { PointShape as PointShapeType } from '../types';

interface Props {
  shape: PointShapeType;
}

export function PointShape({ shape }: Props) {
  return (
    <circle
      data-shape-id={shape.id}
      cx={shape.x}
      cy={shape.y}
      r={6}
      fill="#3b82f6"
      stroke="#1d4ed8"
      strokeWidth={2}
      style={{ pointerEvents: 'all' }}
    />
  );
}
