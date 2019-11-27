const { EventEmitter } = require('events');

const emitter = require('../lib/emitter');

describe('emitter', () => {
  it('should be an object', () => {
    expect(typeof emitter).toBe('object');
  });

  it('should be an instance of EventEmitter', () => {
    expect(emitter).toBeInstanceOf(EventEmitter);
  });
});
