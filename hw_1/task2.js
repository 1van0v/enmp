import csv2json from 'csvtojson';
import fs from 'fs';

const csvPath = './csv';

fs.promises.readdir(csvPath)
  .then(parseCSV);

function parseCSV(files) {
  if (!files.length || !files[0].endsWith('.csv')) {
    return console.error('put csv file into ./csv folder');
  }

  const sourceFile = `${csvPath}/${files[0]}`;
  const destFile = './json_data.txt';

  const readStream = fs.createReadStream(sourceFile);
  const writeStream = fs.createWriteStream(destFile);
  readStream
    .pipe(csv2json())
    .pipe(writeStream)
    .on('finish', () => console.log(`${sourceFile} CSV has been transformed to ${destFile}`))
    .on('error', error => console.log('Something incredible wrong has happened', error));
}