'use strict';

const readline = require('readline');

const ui = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: (line) => {
    const completions = 'hello exit'.split(' ');
    const hits = completions.filter((c) => c.indexOf(line) === 0);
    return [hits.length ? hits : completions, line];
  }
});

ui.setPrompt('OHAI> ');
ui.prompt();

ui.on('line', (line) => {
  switch (line.trim()) {
    case 'hello':
      console.log('world!')
      break;
    case 'exit':
      ui.close();
      break;
    default:
      console.log('Say what? I might have heard `' + line.trim() + '`');
      break;
  }

  ui.prompt();
});

ui.on('SIGCONT', () => {
  ui.prompt();
});

ui.on('close', function() {
  ui.write('Have a great day!');
  process.exit();
});
