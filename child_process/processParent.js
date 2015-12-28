'use strict';

const cp = require('child_process');

const forkedChild = cp.fork(__dirname + '/processChild.js');

forkedChild.on('message', (msg) => {
  console.log('PARENT: Received message', msg);
});

forkedChild.send({ hello: 'from processParent' }, (err) => {
  if (err) {
    throw err;
  }

  console.log('PARENT: Sent message');
});
