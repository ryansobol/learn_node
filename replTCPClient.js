'use strict';

const net = require('net');

const port = 5001;

const socket = net.createConnection(port, () => {
  console.log('Connected to REPL server on TCP port ' + port);
  console.log('Opened socket', socket.address());
  console.log('Press Ctrl-C to quit');

  process.stdin.pipe(socket);
  socket.pipe(process.stdout);
});

socket.on('error', (err) => {
  if (err.code === 'ECONNREFUSED') {
    console.log('ERROR: Connection refused on TCP port ' + port);
    process.exit(1);
  }

  throw err;
});

socket.on('close', () => {
  console.log('Closed socket', socket.address());
  process.exit();
});

process.on('SIGINT', () => {
  socket.end();
});
