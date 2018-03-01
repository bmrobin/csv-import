import axios from 'axios';
import fs from 'fs';
import process from 'process';
import highland from 'highland';
import csv from 'fast-csv';

export default class CsvImporter {
  constructor() {
    this.inputFile = process.argv[2];
    if (!this.inputFile) {
      console.error('No input file specified!');
      console.error('Usage:\n \t node src/index.js /path/to/file.csv');
      throw Error();
    }
    this.counter = 0;
  }

  processBatch(batch) {
    return batch.map((row) => {
      // this is the transform function used to take a ROW and turn it into an OBJECT to be saved
    });
  }

  async saveBatch(vals) {
    console.log('processing batch ', ++this.counter);
    const batch = this.processBatch(vals);
    return axios.post('http://localhost:8080/my-app/import', batch);
  }

  importCsv() {
    const fileStream = fs.createReadStream(this.inputFile);
    const csvStream = csv({
      headers: [ ], // list of CSV headers to be used
      renameHeaders: true,
    });
    highland(fileStream.pipe(csvStream))
      .batch(1000)
      .map((vals) => highland(this.saveBatch(vals)))
      .sequence()
      .errors((errs) => console.error('ERROR: ', errs))
      .done(() => {
        console.log('Finished');
      });
  }
}
