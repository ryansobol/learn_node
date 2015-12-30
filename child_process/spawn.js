'use strict';

const spawn = require('child_process').spawn;

const ls = spawn('ls', ['-hal', '/usr']);

ls.stdout.on('data', (data) => {
  console.log('stdout:', data.toString());
});

ls.on('close', (code) => {
  console.log('spawned process exited with code', code);
});
