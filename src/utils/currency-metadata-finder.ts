/**
 * Code-Name pairs generation
 */
import { CurrencyPair } from '../data-integrations/types';
import { CurrencyMetadata } from '../engine/types';
/**
 * Generated the code-name pairs of currencies with the given dataset
 * @param data
 * @returns
 */
export const findCurrencyMetadata = (
  data: CurrencyPair[]
): CurrencyMetadata[] => {
  return data
    .map((d) => [
      {
        code: d.fromCurrencyCode,
        displayName: d.fromCurrencyName,
      },
      {
        code: d.toCurrencyCode,
        displayName: d.toCurrencyName,
      },
    ])
    .flat() as CurrencyMetadata[];
};
