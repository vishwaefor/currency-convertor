/**
 * Main application for running to generte the exchange rates
 */
import { DataAPI } from './data-integrations/currency-rates-api';
import { CurrencyPair } from './data-integrations/types';
import { CodeValueCache } from './data-structures/code-value-cache';
import { CurrencyConvertor } from './engine/currency-convertor';
import { ConvertedResult, CurrencyMetadata } from './engine/types';
import { writeCSVFile } from './utils/csv-writter';
import { findCurrencyMetadata } from './utils/currency-metadata-finder';

export type DataMode = 'MOCK' | 'REST';
const OUTPUT_DIR: string = 'results';

export class App {
  constructor(private dataUrl: string, private dataMode: DataMode) {}

  /**
   * Calculates the amouns of exchanged money for a given amount of money from a single source
   * @param amount
   * @param fromCurrency
   */
  async run(amount: number, fromCurrency: string) {
    console.log('\n\n## C U R R E N C Y - C O N V E R T E R ##\n\n');

    // Fetching currency pairs from the REST API endpoint or File based on the mode
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

  /**
   * Cache data for taking currency names for given code
   * @param data
   * @returns
   */
  private initCurrencyMetadataCache(data: CurrencyPair[]) {
    const currencyMetaDataCache = new CodeValueCache<CurrencyMetadata>();

    const currencyMetadata: CurrencyMetadata[] = findCurrencyMetadata(data);

    currencyMetadata.forEach((m) => currencyMetaDataCache.addValue(m.code, m));

    return currencyMetaDataCache;
  }

  /**
   * Load data from API or files
   * @param dataUrl
   * @param mode
   * @returns
   */
  private async loadData(dataUrl: string, mode: DataMode) {
    if ('MOCK' === mode) {
      return new DataAPI().fetchMockData(dataUrl);
    } else if ('REST' === mode) {
      return new DataAPI().fetchAPIData(dataUrl);
    } else {
      return [];
    }
  }
  /**
   * Write data report to a csv file
   * @param amount
   * @param source
   * @param bestExchangeRate
   */
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
        'Path for the best conversion rate': r.conversionPath.join(' | '),
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
