'use strict';

const http = require('http');

const options = {
  agent: new http.Agent({ keepAlive: true }),
  hostname: 'localhost',
  method: 'GET',
  path: '/',
  port: 3000,
  protocol: 'http:'
};

const request = http.request(options, (res) => {
  process.stdout.write('HTTP/' + res.httpVersion + ' ');
  console.log(res.statusCode + ' ' + res.statusMessage);

  for (let i = 0; i < res.rawHeaders.length; i += 2) {
    console.log(res.rawHeaders[i] + ':', res.rawHeaders[i + 1]);
  }

  console.log();

  res.on('data', (chunk) => {
    console.log(chunk.length.toString(16));
    console.log(chunk.toString());
  });
});

request.on('socket', (socket) => {
  socket.on('connect', () => {
    console.log('Connected to HTTP server on TCP port ' + options.port);
    console.log('Opened socket', socket.address());
    console.log();
  });
});

request.on('error', (err) => {
  if (err.code === 'ECONNREFUSED') {
    console.log('ERROR: Connection refused on TCP port ' + options.port);
    process.exit(1);
  }

  throw err;
});

request.end(() => {
  console.log(options.method + ' ' + options.path + ' HTTP/1.1\n');
});
