import type { Command, Shape } from '../types';
import { useEditorStore } from '../store/editorStore';


export class AddVertexCommand implements Command {
  private shape: Shape;

  constructor(shape: Shape) {
    this.shape = structuredClone(shape);
  }

  execute(): void {
    useEditorStore.getState().addShape(structuredClone(this.shape));
  }

  undo(): void {
    useEditorStore.getState().removeShape(this.shape.id);
  }
}


export class AddShapeCommand implements Command {
  private shape: Shape;

  constructor(shape: Shape) {
    this.shape = structuredClone(shape);
  }

  execute(): void {
    useEditorStore.getState().addShape(structuredClone(this.shape));
  }

  undo(): void {
    useEditorStore.getState().removeShape(this.shape.id);
  }
}

export class DeleteShapeCommand implements Command {
  private shape: Shape;

  constructor(shape: Shape) {
    this.shape = structuredClone(shape);
  }

  execute(): void {
    useEditorStore.getState().removeShape(this.shape.id);
  }

  undo(): void {
    useEditorStore.getState().addShape(structuredClone(this.shape));
  }
}

export class MoveShapeCommand implements Command {
  private id: string;
  private before: Shape;
  private after: Shape;

  constructor(id: string, before: Shape, after: Shape) {
    this.id = id;
    this.before = structuredClone(before);
    this.after = structuredClone(after);
  }

  execute(): void {
    useEditorStore.getState().updateShape(this.id, structuredClone(this.after));
  }

  undo(): void {
    useEditorStore.getState().updateShape(this.id, structuredClone(this.before));
  }
}
