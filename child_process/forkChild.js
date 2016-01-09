'use strict';

console.log(process.cwd());

process.on('message', (msg) => {
  console.log('CHILD: Received message', msg);
});

process.send({ hello: 'from child' }, (err) => {
  if (err) {
    throw err;
  }

  console.log('CHILD: Sent message');
});
