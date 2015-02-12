'use strict';

var chai      = require('chai'),
    expect    = chai.expect,
    emitter   = require('../lib/emitter');

describe('emitter', function() {
  it('should be an object', function() {
    expect(emitter).to.be.an('object');
  });

  it('should be an instance of EventEmitter', function() {
    expect(emitter).to.be.an.instanceOf(require('events').EventEmitter); 
  });
});

