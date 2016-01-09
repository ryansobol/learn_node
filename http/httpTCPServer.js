'use strict';

const http = require('http');

const port = 3000;

let hasInterrupted = false;
let sockets = [];

const server = http.createServer((req, res) => {
  process.stdout.write('Incoming request: ');
  console.log(req.method + ' ' + req.url + ' HTTP/' + req.httpVersion);

  // Enables chunked transfer
  // https://en.wikipedia.org/wiki/Chunked_transfer_encoding
  // res.writeHead(200);

  // Also enables chunked transfer
  res.write('Hello world\n');

  res.end('Goodbye world\n', () => {
    process.stdout.write('Server response: ');
    console.log('HTTP/1.1 ' + res.statusCode + ' ' + res.statusMessage);
  });
});

server.listen(port, () => {
  console.log('HTTP server listening on port ' + port);
  console.log('Press Ctrl-C to quit');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('ERROR: TCP port ' + port + ' already in use');
    process.exit(1);
  }

  throw err;
});

server.on('connection', (socket) => {
  console.log('Opened socket', socket.address());
  sockets = sockets.concat(socket);

  socket.on('close', () => {
    console.log('Closed socket', socket.address());
    sockets = sockets.filter((s) => s !== socket)
  });
});

server.on('close', () => {
  console.log('HTTP server closed');
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
