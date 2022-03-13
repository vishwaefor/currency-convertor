import { GraphNode } from "./graph-node";

export class SimpleNode extends GraphNode {
  constructor(private _key: string) {
    super();
  }

  get key(): string {
    return this._key;
  }
}
