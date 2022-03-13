import { fstat } from 'fs';
import ObjectsToCsv from 'objects-to-csv';
import path from 'path';
import fs from 'fs';

export const writeCSVFile = async (
  records: { [key: string]: any }[],
  dirname: string,
  filename: string
): Promise<string | undefined> => {
  try {
    fs.mkdir(dirname, { recursive: true }, (err) => {
      if (err) {
        return console.error(err);
      }
    });

    const writter = new ObjectsToCsv(records);
    const fullPath = path.resolve(
      dirname,
      filename + '-' + new Date().valueOf() + '.csv'
    );
    await writter.toDisk(fullPath, {
      append: true,
    });

    return fullPath;
  } catch (error) {
    console.error(error);
  }
};
