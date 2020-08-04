import readline from 'readline';

const rl = readline.createInterface(process.stdin);

rl.on('line', function (line) {
  console.log(line.split('').reverse().join(''), '\n');
})