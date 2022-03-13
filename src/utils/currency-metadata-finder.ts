import { CurrencyPair } from '../data-integrations/types';
import { CurrencyMetadata } from '../engine/types';

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
