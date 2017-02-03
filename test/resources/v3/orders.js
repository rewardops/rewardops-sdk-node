'use strict';

var chai    = require('chai'),
    assert  = chai.assert,
    RO      = require('../../..');

describe('v3 orders', function() {
  before(function() {
    RO.config.set('apiVersion', 'v3');
  });

  after(function() {
    RO.config.reset();
  });

  describe('contextId', function() {
    it('should be the context ID passed to the constructor', function() {
      var programId = 309248,
          programOrders = RO.program(programId).orders;

      assert.equal(programOrders.contextId, programId);
    });
  });
});

