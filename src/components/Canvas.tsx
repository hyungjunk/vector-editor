import { useRef, useCallback, useMemo } from 'react';
import { useEditorStore } from '../store/editorStore';
import { PointShape } from './PointShape';
import { PolygonShape } from './PolygonShape';
import type { Coords, Shape } from '../types';
import type { ModeController } from '../modes/ModeController';
import { PointMode } from '../modes/PointMode';
import { PolygonMode } from '../modes/PolygonMode';
import { MoveMode } from '../modes/MoveMode';
import { DeleteMode } from '../modes/DeleteMode';

const modeControllers: Record<string, ModeController> = {
  point: new PointMode(),
  polygon: new PolygonMode(),
  move: new MoveMode(),
  delete: new DeleteMode(),
};

export function getPolygonMode(): PolygonMode {
  return modeControllers.polygon as PolygonMode;
}

function findShapeId(target: EventTarget | null): string | null {
  let el = target as HTMLElement | SVGElement | null;
  while (el && el !== document.documentElement) {
    const id = el.getAttribute?.('data-shape-id');
    if (id) return id;
    el = el.parentElement;
  }
  return null;
}

export function Canvas() {
  const svgRef = useRef<SVGSVGElement>(null);
  const shapes = useEditorStore((s) => s.shapes);
  const currentMode = useEditorStore((s) => s.currentMode);
  const pendingVertices = useEditorStore((s) => s.pendingVertices);


  const controller = modeControllers[currentMode];

  const getCoords = useCallback(
    (e: React.MouseEvent): Coords => {
      const svg = svgRef.current!;
      const rect = svg.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    },
    []
  );

  const findHitShape = useCallback(
    (e: React.MouseEvent): Shape | null => {
      const id = findShapeId(e.target);
      if (!id) return null;
      return useEditorStore.getState().shapes.find((s) => s.id === id) ?? null;
    },
    []
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      controller.onCanvasMouseDown(getCoords(e), findHitShape(e));
    },
    [controller, getCoords, findHitShape]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      controller.onCanvasMouseMove(getCoords(e));
    },
    [controller, getCoords]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      controller.onCanvasMouseUp(getCoords(e));
    },
    [controller, getCoords]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      controller.onCanvasClick(getCoords(e), findHitShape(e));
    },
    [controller, getCoords, findHitShape]
  );

  const pendingPolyline = useMemo(() => {
    if (currentMode !== 'polygon' || pendingVertices.length === 0) return null;
    const points = pendingVertices.map((v) => `${v.x},${v.y}`).join(' ');
    return (
      <g>
        <polyline
          points={points}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={2}
          strokeDasharray="6 3"
        />
        {pendingVertices.map((v, i) => (
          <circle
            key={i}
            cx={v.x}
            cy={v.y}
            r={4}
            fill="#93c5fd"
            stroke="#3b82f6"
            strokeWidth={1}
          />
        ))}
      </g>
    );
  }, [currentMode, pendingVertices]);

  return (
    <svg
      ref={svgRef}
      style={{
        width: '100%',
        height: '100%',
        cursor: controller.getCursor(),
        background: '#f8fafc',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
    >
      {shapes.map((shape) =>
        shape.type === 'point' ? (
          <PointShape key={shape.id} shape={shape} />
        ) : (
          <PolygonShape key={shape.id} shape={shape} />
        )
      )}
      {pendingPolyline}
    </svg>
  );
}
