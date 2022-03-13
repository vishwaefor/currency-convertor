import { App } from './app';

// Start here
(async () => {
  const dataUrl =
    process.env.DATA_URL ||
    'https://api-coding-challenge.neofinancial.com/currency-conversion?seed=88662';

  new App(dataUrl, 'REST').run(100, 'CAD');
})();
