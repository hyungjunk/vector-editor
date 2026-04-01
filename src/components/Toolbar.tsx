import { useEditorStore } from '../store/editorStore';
import { getPolygonMode } from './Canvas';
import type { EditorMode } from '../types';

const modes: { key: EditorMode; label: string }[] = [
  { key: 'point', label: 'Point' },
  { key: 'polygon', label: 'Polygon' },
  { key: 'move', label: 'Move' },
  { key: 'delete', label: 'Delete' },
];

export function Toolbar() {
  const currentMode = useEditorStore((s) => s.currentMode);
  const setMode = useEditorStore((s) => s.setMode);
  const pendingVertices = useEditorStore((s) => s.pendingVertices);
  const historyManager = useEditorStore((s) => s.historyManager);

  // Subscribe to shapes so Toolbar re-renders when undo/redo changes them
  useEditorStore((s) => s.shapes);

  const canComplete = currentMode === 'polygon' && pendingVertices.length >= 3;

  const handleUndo = () => {
    historyManager.undo();
    // Force re-render by touching store
    
  useEditorStore.setState({});
  };

  const handleRedo = () => {
    historyManager.redo();
    useEditorStore.setState({});
  };

  const handleComplete = () => {
    getPolygonMode().complete();
  };

  return (
    <div style={toolbarStyle}>
      <div style={sectionStyle}>
        <span style={labelStyle}>Mode</span>
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            style={{
              ...buttonStyle,
              ...(currentMode === m.key ? activeButtonStyle : {}),
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div style={sectionStyle}>
        <span style={labelStyle}>Actions</span>
        <button
          onClick={handleUndo}
          disabled={!historyManager.canUndo}
          style={buttonStyle}
        >
          Undo
        </button>
        <button
          onClick={handleRedo}
          disabled={!historyManager.canRedo}
          style={buttonStyle}
        >
          Redo
        </button>
        {canComplete && (
          <button onClick={handleComplete} style={completeButtonStyle}>
            Complete Polygon
          </button>
        )}
      </div>
    </div>
  );
}

const toolbarStyle: React.CSSProperties = {
  display: 'flex',
  gap: '24px',
  padding: '12px 16px',
  background: '#fff',
  borderBottom: '1px solid #e2e8f0',
  alignItems: 'center',
  flexShrink: 0,
};

const sectionStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
};

const labelStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const buttonStyle: React.CSSProperties = {
  padding: '6px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  background: '#fff',
  cursor: 'pointer',
  fontSize: '13px',
  color: '#334155',
};

const activeButtonStyle: React.CSSProperties = {
  background: '#3b82f6',
  color: '#fff',
  borderColor: '#3b82f6',
};

const completeButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: '#10b981',
  color: '#fff',
  borderColor: '#10b981',
};
