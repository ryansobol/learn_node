'use strict';

const http = require('http');

const port = 3000;

let hasInterrupted = false;
let sockets = [];

const server = http.createServer((req, res) => {
  process.stdout.write('Incoming request: ');
  console.log(req.method + ' ' + req.url + ' HTTP/' + req.httpVersion);

  res.end('Hello world\n', () => {
    process.stdout.write('Server response: ');
    console.log('HTTP/1.1 ' + res.statusCode + ' ' + res.statusMessage);
  });
});

server.listen(port, () => {
  console.log('HTTP server listening on port ' + port);
  console.log('Press Ctrl-C to quit');
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
