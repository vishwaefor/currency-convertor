import { GraphNode } from "./graph-node";

export abstract class Edge<N extends GraphNode> {
  constructor(
    private _source: N,
    private _destination: N,
    private _weight: number
  ) {}

  get source(): N {
    return this._source;
  }

  get destination(): N {
    return this._destination;
  }

  get weight(): number {
    return this._weight;
  }
}
