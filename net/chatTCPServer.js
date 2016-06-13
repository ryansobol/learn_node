'use strict';

var net = require('net');
var port = 4000;
var sockets = [];

var server = net.createServer(function(socket) {
  var msg = `Client on TCP port ${socket.remotePort} joined the room`;

  console.log(msg);

  for (var s of sockets) {
    s.write(msg);
    socket.write(`Client on TCP port ${s.remotePort} is in the room`);
  }

  sockets = sockets.concat(socket);

  socket.on('data', function(data) {
    var msg = `<${socket.remotePort}> ${data.toString().trim()}`;

    console.log(msg);

    for (var s of sockets) {
      s.write(msg);
    }
  });

  socket.on('close', function() {
    var msg = `Client on TCP port ${socket.remotePort} left the room`;

    console.log(msg);

    sockets = sockets.filter(function(s) {
      return s !== socket;
    });

    for (var s of sockets) {
      s.write(msg);
    }
  });
});

server.listen(port, function() {
  console.log('Chat server listening on TCP port ' + port);
  console.log('Waiting for clients to join the room');
  console.log('Press Ctrl+C to quit');
});
