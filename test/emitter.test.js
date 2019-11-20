'use strict';

var emitter   = require('../lib/emitter');

describe('emitter', function() {
  it('should be an object', function() {
    expect(typeof emitter).toBe('object');
  });

  it('should be an instance of EventEmitter', function() {
    expect(emitter).toBeInstanceOf(require('events').EventEmitter);
  });
});

