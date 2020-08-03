const csv2json = require('csvtojson');
const fs = require('fs');

const csvPath = './csv';

fs.promises.readdir(csvPath)
  .then(parseCSV);

function parseCSV(files) {
  if (!files.length || !files[0].endsWith('.csv')) {
    return console.error('put csv file into ./csv folder');
  }

  const readStream = fs.createReadStream(`${csvPath}/${files[0]}`);
  const writeStream = fs.createWriteStream('./json_data.txt');
  readStream
    .pipe(csv2json())
    .pipe(writeStream)
    .on('error', error => console.log('Something incredible wrong has happened', error));
}