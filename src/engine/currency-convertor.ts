/**
 * Currency converter logics
 */
import { BellmanFord } from '../algorithms/bellmanford';
import { CurrencyPair } from '../data-integrations/types';
import { CodeValueCache } from '../data-structures/code-value-cache';
import { Graph } from '../data-structures/graph';
import { SimpleEdge } from '../data-structures/simple-edge';
import { SimpleNode } from '../data-structures/simple-node';
import { ConvertedResult, CurrencyMetadata } from './types';

export class CurrencyConvertor {
  private bellmanfordAlgo: BellmanFord<SimpleNode>;

  constructor(private currencyMetaData: CodeValueCache<CurrencyMetadata>) {
    this.bellmanfordAlgo = new BellmanFord<SimpleNode>();
  }
  /**
   * Finds the best exchange rates for other currencies from a given currency
   * @param data
   * @param fromCurrency
   * @returns
   */
  findBestExchangeRates(
    data: CurrencyPair[],
    fromCurrency: string
  ): ConvertedResult[] {
    console.log('\n\n....... finding the best exchange rates .......');

    // As explained in the README, the weights are converted to log values and negated
    const simpleEdgeList = data.map(
      (e) =>
        new SimpleEdge(
          new SimpleNode(e.fromCurrencyCode),
          new SimpleNode(e.toCurrencyCode),
          -Math.log(e.exchangeRate)
        )
    );

    // Storing data in a graph datastructure
    const graph = new Graph<SimpleNode>(simpleEdgeList);

    // Using the Belmonford algorithm to find the minimum weights for the single source
    const minimumWeights = this.bellmanfordAlgo.run(graph, fromCurrency);

    // Converting log weights back to exchange rates
    const convertedResults: ConvertedResult[] = Object.keys(minimumWeights).map(
      (key) => ({
        from: {
          code: fromCurrency,
          displayName:
            this.currencyMetaData.findValue(fromCurrency)?.displayName ||
            fromCurrency,
        },
        to: {
          code: key,
          displayName: this.currencyMetaData.findValue(key)?.displayName || key,
        },
        bestExchangeRate: Math.exp(-minimumWeights[key].value), // Undoing the logrithamic action
        conversionPath: this.bellmanfordAlgo.tracePath(
          minimumWeights,
          fromCurrency,
          key
        ),
      })
    );

    return convertedResults;
  }
}
