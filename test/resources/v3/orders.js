'use strict';

var chai    = require('chai'),
    assert  = chai.assert,
    RO      = require('../../..');

describe('orders', function() {
  before(function() {
    RO.config.set('apiVersion', 'v3');
  });

  after(function() {
    RO.config.reset();
  });

  it('should create an orders object for a program', function() {
    var programOrders = RO.program(488).orders;

    assert.typeOf(programOrders, 'object');
  });

  describe('contextId', function() {
    it('should be the context ID passed to the constructor', function() {
      var programId = 309248,
          programOrders = RO.program(programId).orders;

      assert.typeOf(programOrders.contextId, 'number');
      assert.equal(programOrders.contextId, programId);
    });
  });
});

