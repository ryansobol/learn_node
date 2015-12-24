'use strict';

const net = require('net');
const repl = require('repl');

const port = 5001;

let hasInterrupted = false;
let sockets = [];

const server = net.createServer((socket) => {
  const replServer = repl.start({
    input: socket,
    output: socket
  });

  replServer.on('exit', () => {
    socket.end()
  });

  replServer.context.t = 'It works!';

  console.log('Opened socket', socket.address());
  sockets = sockets.concat(socket);

  socket.on('data', (data) => {
    process.stdout.write('> ' + data, 'utf8');
  });

  socket.on('close', () => {
    console.log('Closed socket', socket.address());
    sockets = sockets.filter((s) => s !== socket);
  });
});

server.listen(port, () => {
  console.log('REPL server listening on port ' + port);
  console.log('Press Ctrl-C to quit');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('ERROR: TCP port ' + port + ' already in use');
    process.exit(1);
  }

  throw err;
});

process.on('SIGINT', () => {
  if (hasInterrupted) {
    sockets.forEach((s) => s.destroy());
    process.exit(130);
  }

  hasInterrupted = true;

  if (sockets.length) {
    console.log('Waiting for socket(s) to close');
    console.log('Press Ctrl-C again to forceable quit');
  }

  server.close(() => {
    process.exit();
  });
});
