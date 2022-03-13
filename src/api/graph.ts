import { DataAPI } from '../data-integrations/currency-rates-api';
import { CurrencyPair } from '../data-integrations/types';
import { CodeValueCache } from '../data-structures/code-value-cache';
import { CurrencyConvertor } from '../engine/currency-convertor';
import { ConvertedResult, CurrencyMetadata } from '../engine/types';
import { findCurrencyMetadata } from '../utils/currency-metadata-finder';

export const getGraphData = async (
  dataUrl: string,
  amount: number,
  fromCurrency: string
): Promise<any[]> => {
  const data = await new DataAPI().fetchAPIData(dataUrl);

  // Caching additional data for future usage
  const currencyMetaDataCache = initCurrencyMetadataCache(data);

  // Finding the best conversion rates
  const bestExchangeRates = new CurrencyConvertor(
    currencyMetaDataCache
  ).findBestExchangeRates(data, fromCurrency);

  // Conversions for the amount
  return bestExchangeRates.map((r) => ({
    'Currency Code': r.to.code,
    Country: r.to.displayName,
    'Amount of currency': (r.bestExchangeRate * amount).toFixed(2),
    'Path for the best conversion rate': r.conversionPath.join(' | '),
  }));
};

const initCurrencyMetadataCache = (data: CurrencyPair[]) => {
  const currencyMetaDataCache = new CodeValueCache<CurrencyMetadata>();

  const currencyMetadata: CurrencyMetadata[] = findCurrencyMetadata(data);

  currencyMetadata.forEach((m) => currencyMetaDataCache.addValue(m.code, m));

  return currencyMetaDataCache;
};
