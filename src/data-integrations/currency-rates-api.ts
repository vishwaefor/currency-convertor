import { CurrencyPair } from './types';
import 'isomorphic-fetch';

export class DataAPI {
  async fetchAPIData(dataUrl: string): Promise<CurrencyPair[]> {
    const data: CurrencyPair[] = [];

    try {
      console.log(`\nreading data from ${dataUrl}`);

      const response = await fetch(dataUrl);
      const jsonData = await response.json();
      data.push(...jsonData);

      console.log(`\nfinished reading data from ${dataUrl}`);
    } catch (error) {
      console.error(error);
    }

    return data;
  }

  async fetchMockData(fileName: string): Promise<CurrencyPair[]> {
    const data: CurrencyPair[] = [];

    try {
      console.log(`\nreading mockdata from ${fileName}`);
      
      const mockData = (await import(fileName)).default;
      data.push(...mockData);

      console.log(`\nfinished reading data from ${fileName}`);
    } catch (error) {
      console.error(error);
    }

    return data;
  }
}
