import type { PolygonShape as PolygonShapeType } from '../types';

interface Props {
  shape: PolygonShapeType;
}

export function PolygonShape({ shape }: Props) {
  const points = shape.vertices.map((v) => `${v.x},${v.y}`).join(' ');

  return (
    <g data-shape-id={shape.id} style={{ pointerEvents: 'all' }}>
      <polygon
        points={points}
        fill="rgba(59, 130, 246, 0.3)"
        stroke="#3b82f6"
        strokeWidth={2}
      />
      {shape.vertices.map((v, i) => (
        <circle
          key={i}
          cx={v.x}
          cy={v.y}
          r={4}
          fill="#3b82f6"
          stroke="#1d4ed8"
          strokeWidth={1}
        />
      ))}
    </g>
  );
}
