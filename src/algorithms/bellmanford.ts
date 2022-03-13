import { Graph } from '../data-structures/graph';
import { GraphNode } from '../data-structures/graph-node';
import { WeightsMap } from '../data-structures/types';

export class BellmanFord<N extends GraphNode> {
  private static INFINITY = Infinity;

  run(graph: Graph<N>, source: string): WeightsMap {
    const weights: WeightsMap = {};

    // Initializing weights as infinity

    for (let edge of graph.edgeList) {
      weights[edge.source.key] = {
        value: BellmanFord.INFINITY,
      };
      weights[edge.destination.key] = {
        value: BellmanFord.INFINITY,
      };
    }

    // Setting zero as the weight to source
    weights[source] = { value: 0 };

    const numberOfNodes = Object.keys(weights).length;

    // Relaxing
    for (let i = 0; i < numberOfNodes - 1; i++) {
      for (let edge of graph.edgeList) {
        const newWeight = weights[edge.source.key].value + edge.weight;

        if (newWeight < weights[edge.destination.key].value) {
          weights[edge.destination.key].value = newWeight;
          weights[edge.destination.key].parent = edge.source.key;
        }
        // console.log(weights);
      }
    }

    // Negative cycle detection

    for (let edge of graph.edgeList) {
      const newWeight = weights[edge.source.key].value + edge.weight;

      if (newWeight < weights[edge.destination.key].value) {
        weights[edge.destination.key].parent = undefined;
        // console.log('Negative cycles detected');
      }
    }
    // console.log(weights);
    return weights;
  }

  tracePath(
    weightsMap: WeightsMap,
    source: string,
    destination: string
  ): string[] {
    const path: string[] = [];
    this.traverse(weightsMap, source, destination, path);
    path.unshift(source);
    return path;
  }

  private traverse(
    weightsMap: WeightsMap,
    source: string,
    destination: string | undefined,
    path: string[]
  ) {
    if (destination && destination !== source) {
      path.unshift(destination);
      this.traverse(weightsMap, source, weightsMap[destination].parent, path);
    }
  }
}
