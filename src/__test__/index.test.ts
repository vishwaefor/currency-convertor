import path from 'path';
import { App } from '../app';

(async () => {
  const testDataPath = path.resolve(
    __dirname,
    '..',
    '..',
    'mock-data',
    'currency-pairs.json'
  );

  new App(testDataPath, 'MOCK').run(100, 'CAD');
})();
