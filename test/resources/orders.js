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

  describe('getAll()', function() {
    it('should return an array to the callback', function(done) {
      RO.program(67).orders.getAll(function(error, data) {
        expect(data).to.be.an('array');

        done();
      });
    });
  });

  describe('get()', function() {
    it('should return an object to the callback', function(done) {
      RO.program(398).orders.get(1654, function(error, data) {
        expect(error).to.equal(null);

        expect(data).to.be.an('object');

        done();
      });
    });
  });

  describe('create()', function() {
    it('should return an object to the callback', function(done) {
      RO.program(2994).orders.create({}, function(error, response) {
        expect(error).to.equal(null);

        expect(response).to.be.an('object');

        done();
      });
    });
  });
});

