'use strict';

const net = require('net');
const repl = require('repl');

const port = 5001;

let hasInterrupted = false;
let sockets = [];

const server = net.createServer((socket) => {
  console.log('Opened socket', socket);

  const replServer = repl.start({
    input: socket,
    output: socket
  });

  replServer.on('exit', () => {
    socket.end()
  });

  replServer.context.m = 'It worked!';

  socket.on('data', (data) => {
    process.stdout.write('> ' + data, 'utf8');
  });

  socket.on('close', () => {
    console.log('Closed socket', socket);
    sockets = sockets.filter((s) => s !== socket);
  });

  sockets = sockets.concat(socket);
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
    sockets.forEach((socket) => socket.destroy());
    process.exit(130);
  }

  hasInterrupted = true;

  server.getConnections((err, count) => {
    if (err) {
      console.log(err);
    }

    if (count > 0) {
      console.log('Waiting for socket(s) to close');
      console.log('Press Ctrl-C again to forceable quit');
    }

    server.close(() => {
      process.exit();
    });
  });
});
