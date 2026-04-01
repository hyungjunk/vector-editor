import { describe, it, expect, vi } from 'vitest';
import { HistoryManager } from '../src/history/historyManager';
import type { Command } from '../src/types';

function mockCommand(): Command {
  return {
    execute: vi.fn(),
    undo: vi.fn(),
  };
}

describe('HistoryManager', () => {
  it('executes a command', () => {
    const hm = new HistoryManager();
    const cmd = mockCommand();
    hm.execute(cmd);
    expect(cmd.execute).toHaveBeenCalledOnce();
  });

  it('reports canUndo/canRedo correctly', () => {
    const hm = new HistoryManager();
    expect(hm.canUndo).toBe(false);
    expect(hm.canRedo).toBe(false);

    hm.execute(mockCommand());
    expect(hm.canUndo).toBe(true);
    expect(hm.canRedo).toBe(false);
  });

  it('undoes a command', () => {
    const hm = new HistoryManager();
    const cmd = mockCommand();
    hm.execute(cmd);
    hm.undo();
    expect(cmd.undo).toHaveBeenCalledOnce();
    expect(hm.canUndo).toBe(false);
    expect(hm.canRedo).toBe(true);
  });

  it('redoes a command', () => {
    const hm = new HistoryManager();
    const cmd = mockCommand();
    hm.execute(cmd);
    hm.undo();
    hm.redo();
    expect(cmd.execute).toHaveBeenCalledTimes(2);
    expect(hm.canUndo).toBe(true);
    expect(hm.canRedo).toBe(false);
  });

  it('clears redo stack on new execute', () => {
    const hm = new HistoryManager();
    const cmd1 = mockCommand();
    const cmd2 = mockCommand();
    hm.execute(cmd1);
    hm.undo();
    expect(hm.canRedo).toBe(true);

    hm.execute(cmd2);
    expect(hm.canRedo).toBe(false);
  });

  it('undo on empty stack is a no-op', () => {
    const hm = new HistoryManager();
    expect(() => hm.undo()).not.toThrow();
    expect(hm.canUndo).toBe(false);
  });

  it('redo on empty stack is a no-op', () => {
    const hm = new HistoryManager();
    expect(() => hm.redo()).not.toThrow();
    expect(hm.canRedo).toBe(false);
  });

  it('handles multiple undo/redo in sequence', () => {
    const hm = new HistoryManager();
    const cmd1 = mockCommand();
    const cmd2 = mockCommand();
    const cmd3 = mockCommand();

    hm.execute(cmd1);
    hm.execute(cmd2);
    hm.execute(cmd3);

    hm.undo(); // undo cmd3
    hm.undo(); // undo cmd2
    hm.undo(); // undo cmd1

    expect(hm.canUndo).toBe(false);
    expect(hm.canRedo).toBe(true);

    hm.redo(); // redo cmd1
    hm.redo(); // redo cmd2

    expect(cmd1.execute).toHaveBeenCalledTimes(2);
    expect(cmd2.execute).toHaveBeenCalledTimes(2);
    expect(hm.canUndo).toBe(true);
    expect(hm.canRedo).toBe(true);
  });

  it('clear removes all history', () => {
    const hm = new HistoryManager();
    hm.execute(mockCommand());
    hm.execute(mockCommand());
    hm.undo();

    hm.clear();
    expect(hm.canUndo).toBe(false);
    expect(hm.canRedo).toBe(false);
  });
});
