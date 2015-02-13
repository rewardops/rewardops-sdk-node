'use strict';

var chai    = require('chai'),
    expect  = chai.expect,
    RO      = require('../..');

describe('orders', function() {
  it('should create an orders object for a program', function() {
    var programOrders = RO.program(488).orders;

    expect(programOrders).to.be.an('object');
  });

  describe('contextId', function() {
    it('should be the context ID passed to the constructor', function() {
      var programId = 309248,
          programOrders = RO.program(programId).orders;

      expect(programOrders.contextId).to.be.a('number').and.to.equal(programId);
    });
  });
});

