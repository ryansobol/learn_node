#!/usr/bin/env node

'use strict';

process.on('message', (msg) => {
  console.log('CHILD: Received message', msg);
});

process.send({ hello: 'from child' }, (err) => {
  if (err) {
    throw err;
  }

  console.log('CHILD: Sent message');
});
