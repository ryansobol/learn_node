'use strict';

const execFile = require('child_process').execFile;

const child = execFile('cat', ['/etc/paths'], (err, stdout, stderr) => {
  if (err) {
    throw err;
  }

  console.log(stdout);
});
