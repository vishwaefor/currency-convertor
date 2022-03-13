import { Edge } from './edge';
import { GraphNode } from './graph-node';
import { AdgacencyList } from './types';

export class Graph<N extends GraphNode> {
  constructor(private _edgeList: Edge<N>[]) {}

  get edgeList(): Edge<N>[] {
    return this._edgeList;
  }

  get adgacencyList(): AdgacencyList<N> {
    return {};
  }
}
