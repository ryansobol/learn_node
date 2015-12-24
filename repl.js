'use strict';

const net = require('net');
const repl = require('repl');
const replServer = repl.start('stdin> ');

replServer.context.m = 'It worked!';

replServer.on('reset', (context) => {
  context.m = 'message';
});

replServer.defineCommand('hello', {
  help: 'Say hello',
  action: function(name) {
    this.write('Hello, ' + name + '!\n');
    this.displayPrompt();
  }
});
