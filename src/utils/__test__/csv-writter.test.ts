import { writeCSVFile } from '../csv-writter';

(async () => {
  const records = [
    {
      code: 'CAD',
      country: 'Canada',
      path: 'CAD|USD|EUR',
      testString: '"hello \' sdf, asd\' "',
    },
    { code: 'USD', country: 'USA', path: 'USA|USD|CAD' },
  ];

  await writeCSVFile(records, 'results', 'test');
})();
