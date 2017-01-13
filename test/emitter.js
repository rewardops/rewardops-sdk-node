'use strict';

var chai      = require('chai'),
    assert    = chai.assert,
    emitter   = require('../lib/emitter');

describe('emitter', function() {
  it('should be an object', function() {
    assert.typeOf(emitter, 'object');
  });

  it('should be an instance of EventEmitter', function() {
    assert.instanceOf(emitter, require('events').EventEmitter);
  });
});

