'use strict';

const spawn = require('child_process').spawn;

// Mimic the default fork() function (i.e. non-silent child)
const spawnChild = spawn('./spawnChild.js', {
  stdio: [0, 1, 2, 'ipc']
});

spawnChild.on('message', (msg) => {
  console.log('PARENT: Received message', msg);
});

spawnChild.send({ hello: 'from parent' }, (err) => {
  if (err) {
    throw err;
  }

  console.log('PARENT: Sent message');
});
