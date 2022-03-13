export type CurrencyMetadata = {
  code: string;
  displayName: string;
};

export type ConvertedResult = {
  from: CurrencyMetadata;
  to: CurrencyMetadata;
  bestExchangeRate: number;
  convertionPath: string[];
};
