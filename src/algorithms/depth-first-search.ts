import { Graph } from '../data-structures/graph';
import { GraphNode } from '../data-structures/graph-node';

export class DepthFirstSearch<N extends GraphNode> {
  run(
    graph: Graph<N>,
    current: string,
    from: string,
    executor?: (current: N, parent: string) => void
  ) {
    this.dfs(graph, current, from, new Set(), executor);
  }

  topSort(graph: Graph<N>, current: string, from: string): string[] {
    const topSortStack: string[] = [];
    this.dfs(graph, current, from, new Set(), undefined, topSortStack);
    return topSortStack;
  }

  private dfs(
    graph: Graph<N>,
    current: string,
    from: string,
    visited: Set<string>,
    executor?: (current: N, parent: string) => void,
    topSortStack?: string[]
  ) {
    for (let neighbour of graph.adgacencyList[current]||[]) {
      executor && executor(neighbour.node, from);

      if (!visited.has(neighbour.node.key)) {
        // console.log(current + ' -> ' + neighbour.node.key);

        visited.add(neighbour.node.key);
        this.dfs(
          graph,
          neighbour.node.key,
          current,
          visited,
          executor,
          topSortStack
        );
      } else {
        if (neighbour.node.key === from) {
          console.log(current + ' -> ' + neighbour.node.key + ': cycle');
        }
        // else {
        //   console.log(current + ' -> ' + neighbour.node.key + ': visited');
        // }
      }
    }

    if (topSortStack) {
      topSortStack.unshift(current);
    }
  }
}
