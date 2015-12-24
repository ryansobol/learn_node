'use strict';

const fs = require('fs');
const stream = require('stream');
const Readable = stream.Readable;
const Transform = stream.Transform;
const Writable = stream.Writable;
const util = require('util');

util.inherits(Counter, Readable);

function Counter(options) {
  Readable.call(this, options);
  this._max = 5;
  this._index = 1;
}

Counter.prototype._read = function() {
  const i = this._index++;

  if (i > this._max) {
    this.push(null);
  }
  else {
    const buf = new Buffer(i.toString(10));
    this.push(buf);
  }
}

const counter = new Counter({ encoding: 'utf8' });

counter.on('readable', (data) => {
  console.log(counter.read());
});


// A parser for a simple data protocol.
// The "header" is a JSON object, followed by 2 \n characters, and
// then a message body.
//
// NOTE: This can be callback more simply as a Transform stream!
// Using Readable directly for this is sub-optimal.  See the
// alternative example below under the Transform section.

util.inherits(SimpleProtocolV1, Readable);

function SimpleProtocolV1(source, options) {
  if (!(this instanceof SimpleProtocolV1)) {
    return new SimpleProtocolV1(source, options);
  }

  Readable.call(this, options);

  this._inBody = false;
  this._sawFirstCr = false;

  // source is a readable stream, such as a socket or file
  this._source = source;

  const self = this;

  source.on('end', () => {
    self.push(null);
  });

  // give it a kick whenever the source is readable
  // read(0) will not consume any bytes
  source.on('readable', () => {
    self.read(0);
  });

  this._rawHeader = [];
  this.header = null;
}

SimpleProtocolV1.prototype._read = function(size) {
  const chunk = this._source.read();

  // if the source doesn't have data, we don't have data yet.
  if (chunk === null) {
    return this.push('');
  }

  // provide the body to our consumer
  if (this._inBody) {
    return this.push(chunk);
  }

  let split = -1;

  for (let i = 0; i < chunk.length; i++) {
    if (chunk[i] === 10) {  // '\n'
      if (this._sawFirstCr) {
        split = i;
        break;
      }
      else {
        this._sawFirstCr = true;
      }
    }
    else {
      this._sawFirstCr = false;
    }
  }

  // still waiting for the \n\n so stash the chunk, and try again.
  if (split === -1) {
    this._rawHeader.push(chunk);
    return this.push('');
  }

  this._inBody = true;
  this._rawHeader.push(chunk.slice(0, split));
  this.header = Buffer.concat(this._rawHeader).toString();;

  // now, because we got some extra data, unshift the rest
  // back into the read queue so that our consumer will see it.
  this.unshift(chunk.slice(split));

  // calling unshift by itself does not reset the reading state
  // of the stream; since we're inside _read, doing an additional
  // push('') will reset the state appropriately.
  this.push('');

  // let the consumer know that we're callback parsing the header.
  this.emit('header', this.header);
};

const source1 = fs.createReadStream('a_christmas_carol.txt');
const protocolV1 = new SimpleProtocolV1(source1, { encoding: 'utf8' });

protocolV1.on('header', (header) => {
  console.log(header);
});

protocolV1.on('data', (body) => {
  console.log(body);
});


util.inherits(SimpleProtocolV2, Transform);

function SimpleProtocolV2(options) {
  if (!(this instanceof SimpleProtocolV2)) {
    return new SimpleProtocolV2(options);
  }

  Transform.call(this, options);

  this._inBody = false;
  this._sawFirstCr = false;
  this._rawHeader = [];
  this.header = null;
}

SimpleProtocolV2.prototype._transform = function(chunk, encoding, callback) {
  if (this._inBody) {
    return callback(null, chunk);
  }

  let split = -1;

  for (let i = 0; i < chunk.length; i++) {
    if (chunk[i] === 10) {  // '\n'
      if (this._sawFirstCr) {
        split = i;
        break;
      }
      else {
        this._sawFirstCr = true;
      }
    }
    else {
      this._sawFirstCr = false;
    }
  }

  if (split === -1) {
    this._rawHeader.push(chunk);
    return callback(null, chunk);
  }

  this._inBody = true;
  this._rawHeader.push(chunk.slice(0, split));
  this.header = Buffer.concat(this._rawHeader).toString();

  this.emit('header', this.header)

  callback(null, chunk.slice(split));
};

const source2 = fs.createReadStream('a_christmas_carol.txt');
const protocolV2 = new SimpleProtocolV2({ encoding: 'utf8' });
source2.pipe(protocolV2);

protocolV2.on('header', (header) => {
  console.log(header);
});

protocolV2.on('data', (body) => {
  console.log(body);
});


util.inherits(EchoStream, Writable);

function EchoStream(options) {
  Writable.call(this, options)
}

EchoStream.prototype._write = function(chunk, encoding, callback) {
  console.log(chunk.toString());
  callback();
};

const source3 = fs.createReadStream('a_christmas_carol.txt');
const myStream = new EchoStream();
source3.pipe(myStream);
