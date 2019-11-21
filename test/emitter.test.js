const { EventEmitter } = require('events');

const emitter = require('../lib/emitter');

describe('emitter', function() {
  it('should be an object', function() {
    expect(typeof emitter).toBe('object');
  });

  it('should be an instance of EventEmitter', function() {
    expect(emitter).toBeInstanceOf(EventEmitter);
  });
});
