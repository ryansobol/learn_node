'use strict';

const fork = require('child_process').fork;

const forkChild = fork(__dirname + '/forkChild.js');

forkChild.on('message', (msg) => {
  console.log('PARENT: Received message', msg);
});

forkChild.send({ hello: 'from parent' }, (err) => {
  if (err) {
    throw err;
  }

  console.log('PARENT: Sent message');
});
