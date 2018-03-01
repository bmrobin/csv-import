import axios from 'axios';
import fs from 'fs';
import process from 'process';
import highland from 'highland';
import csv from 'fast-csv';
import chalk from 'chalk';

// fictional for the moment
const apiUrl = 'http://localhost:8080/my-app/import';

// list of CSV headers to be used
const headers = [ ];

export default class CsvImporter {
  constructor() {
    this.inputFile = process.argv[2];
    if (!this.inputFile) {
      console.error(chalk.red('No input file specified!'));
      console.log(chalk.magenta('\nUsage:\n    node src/index.js /path/to/file.csv\n'));
      process.exit(1);
    }
    this.counter = 0;
  }

  processBatch(batch) {
    return batch.map((row) => {
      // this is the transform function used to take a ROW and turn it into an OBJECT to be saved
      // make this a callback function?
    });
  }

  async saveBatch(vals) {
    console.log(chalk.yellow('processing batch ', ++this.counter));
    const batch = this.processBatch(vals);
    return axios.post(apiUrl, batch);
  }

  importCsv() {
    const fileStream = fs.createReadStream(this.inputFile);
    const csvStream = csv({
      headers: headers,
      renameHeaders: true,
    });
    highland(fileStream.pipe(csvStream))
      .batch(1000)
      .map((vals) => highland(this.saveBatch(vals)))
      .sequence()
      .errors((errs) => console.error(chalk.red('ERROR: ', errs)))
      .done(() => {
        console.log(chalk.green('Finished'));
      });
  }
}
