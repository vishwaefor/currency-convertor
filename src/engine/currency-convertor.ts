import { BellmanFord as BellmanFord } from '../algorithms/bellmanford';
import { CurrencyPair } from '../data-integrations/types';
import { CodeValueCache } from '../data-structures/code-value-cache';
import { Graph } from '../data-structures/graph';
import { SimpleEdge } from '../data-structures/simple-edge';
import { SimpleNode } from '../data-structures/simple-node';
import { WeightsMap } from '../data-structures/types';
import { ConvertedResult, CurrencyMetadata } from './types';

export class CurrencyConvertor {
  private bellmanfordAlgo: BellmanFord<SimpleNode>;

  constructor(private currencyMetaData: CodeValueCache<CurrencyMetadata>) {
    this.bellmanfordAlgo = new BellmanFord<SimpleNode>();
  }

  findBestExchangeRates(
    data: CurrencyPair[],
    fromCurrency: string
  ): ConvertedResult[] {
    console.log('\n\n....... finding the best exchange rates .......');

    // Storing data in a graph datastructure

    // As explained in the README, the weights are converted to log values and negated
    const simpleEdgeList = data.map(
      (e) =>
        new SimpleEdge(
          new SimpleNode(e.fromCurrencyCode),
          new SimpleNode(e.toCurrencyCode),
          -Math.log(e.exchangeRate)
        )
    );

    const graph = new Graph<SimpleNode>(simpleEdgeList);

    // Using the Belmonford algorithm to find the minimum weights for the single source
    const minimumWeights = this.bellmanfordAlgo.run(graph, fromCurrency);

    // Converting log weights back to exchange rates

    const convertedResults: ConvertedResult[] = Object.keys(minimumWeights).map(
      (k) => ({
        from: {
          code: fromCurrency,
          displayName:
            this.currencyMetaData.findValue(fromCurrency)?.displayName ||
            fromCurrency,
        },
        to: {
          code: k,
          displayName: this.currencyMetaData.findValue(k)?.displayName || k,
        },
        bestExchangeRate: Math.exp(-minimumWeights[k].value),
        convertionPath: this.bellmanfordAlgo.tracePath(
          minimumWeights,
          fromCurrency,
          k
        ),
      })
    );

    return convertedResults;
  }
}
