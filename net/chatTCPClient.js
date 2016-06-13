'use strict';

var net = require('net');
var port = 4000;

var socket = net.createConnection(port, function() {
  console.log('Connected to Chat server listening on TCP port', port);
  console.log('Opened socket on TCP port', socket.localPort);
  console.log('Type a message and press the Enter key to send');
  console.log('Press Ctrl+C to quit');

  process.stdin.on('data', function(data) {
    socket.write(data);
  });

  socket.on('data', function(data) {
    console.log(data.toString());
  });

  socket.on('close', function() {
    console.log('Closed socket by the server');
    process.exit();
  });
});
