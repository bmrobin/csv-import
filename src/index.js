require('babel-register');
require('babel-polyfill');
const CsvImporter = require('./CsvImporter.js').default;

const importer = new CsvImporter();
importer.importCsv();
