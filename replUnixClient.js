'use strict';

const net = require('net');

const path = '/tmp/node-repl.sock';

const socket = net.createConnection(path, () => {
  console.log('Connected to REPL server at Unix path ' + path);
  console.log('Opened socket', socket);
  console.log('Press Ctrl-C to quit');

  process.stdin.pipe(socket);
  socket.pipe(process.stdout);
});

socket.on('error', (err) => {
  if (err.code === 'ENOENT') {
    console.log('ERROR: No Unix path ' + path);
    process.exit(1);
  }

  throw err;
});

socket.on('close', () => {
  console.log('Closed socket', socket);
  process.exit();
});

process.on('SIGINT', () => {
  socket.end();
});
