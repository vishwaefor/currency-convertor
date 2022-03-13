import { DepthFirstSearch } from './algorithms/depth-first-search';
import { Graph } from './data-structures/graph';
import { SimpleEdge } from './data-structures/simple-edge';
import { SimpleNode } from './data-structures/simple-node';
import { DataAPI } from './data-integrations/currency-rates-api';
import { CurrencyConvertor } from './engine/currency-convertor';
import { ConvertedResult, CurrencyMetadata } from './engine/types';
import { CodeValueCache } from './data-structures/code-value-cache';
import { findCurrencyMetadata } from './utils/currency-metadata-finder';
import { CurrencyPair } from './data-integrations/types';
import { writeCSVFile } from './utils/csv-writter';

export type DataMode = 'MOCK' | 'REST';
const OUTPUT_DIR: string = 'results';
export class App {
  constructor(private dataUrl: string, private dataMode: DataMode) {}

  async run(amount: number, fromCurrency: string) {
    console.log('\n\n## C U R R E N C Y - C O N V E R T O R ##\n\n');

    // Fetching currency pairs from the REST API endpoint
    const data = await this.loadData(this.dataUrl, this.dataMode);
    // Caching additional data for future usage
    const currencyMetaDataCache = this.initCurrencyMetadataCache(data);

    // Finding the best conversion rates
    const bestExchangeRates = new CurrencyConvertor(
      currencyMetaDataCache
    ).findBestExchangeRates(data, fromCurrency);

    // console.log(bestExchangeRates);

    //Writting report of the conversion for a given amount to CSV
    await this.writeReportToCSVFile(amount, fromCurrency, bestExchangeRates);

    console.log('\n\n## F I N I S H E D ##\n');
  }

  private initCurrencyMetadataCache(data: CurrencyPair[]) {
    const currencyMetaDataCache = new CodeValueCache<CurrencyMetadata>();

    const currencyMetadata: CurrencyMetadata[] = findCurrencyMetadata(data);

    currencyMetadata.forEach((m) => currencyMetaDataCache.addValue(m.code, m));

    return currencyMetaDataCache;
  }

  private async loadData(dataUrl: string, mode: DataMode) {
    if ('MOCK' === mode) {
      return new DataAPI().fetchMockData(dataUrl);
    } else if ('REST' === mode) {
      return new DataAPI().fetchAPIData(dataUrl);
    } else {
      return [];
    }
  }

  private async writeReportToCSVFile(
    amount: number,
    source: string,
    bestExchangeRate: ConvertedResult[]
  ) {
    console.log('....... writing  the report to CSV .......');

    const convertedValues: { [key: string]: any }[] = bestExchangeRate.map(
      (r) => ({
        'Currency Code': r.to.code,
        Country: r.to.displayName,
        'Amount of currency': (r.bestExchangeRate * amount).toFixed(2),
        'Path for the best conversion rate': r.convertionPath.join(' | '),
      })
    );

    const writtenPath = await writeCSVFile(
      convertedValues,
      OUTPUT_DIR,
      `${source}-${amount}`
    );

    writtenPath &&
      console.log(`\n\nplease find the report saved in ${writtenPath}`);
  }
}
