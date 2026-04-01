import { useEffect } from 'react';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { useEditorStore } from './store/editorStore';

export default function App() {
  const historyManager = useEditorStore((s) => s.historyManager);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        historyManager.undo();
        useEditorStore.setState({});
      }
      if (mod && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        historyManager.redo();
        useEditorStore.setState({});
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyManager]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Toolbar />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Canvas />
      </div>
    </div>
  );
}
