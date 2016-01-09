'use strict';

const spawn = require('child_process').spawn;
const child = spawn('node', ['--interactive']);

// process.stdin.pipe(child.stdin)
process.stdin.on('data', function(data) {
  child.stdin.write(data);
});

// child.stdout.pipe(process.stdout)
child.stdout.on('data', function(data) {
  process.stdout.write(data);
});

// child.stderr.pipe(process.stderr)
child.stderr.on('data', function(data) {
  process.stderr.write(data);
});

child.on('close', function(code) {
  process.exit();
});
