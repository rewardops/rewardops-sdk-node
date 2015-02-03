'use strict';

var chai    = require('chai'),
    expect  = chai.expect,
    Orders  = require('../../lib/resources/orders.js');

describe('Orders', function() {
  it('should create an orders object for a program', function() {
    var programOrders = new Orders('program', 488);

    expect(programOrders).to.be.an('object').and.to.be.an.instanceof(Orders);
  });

  describe('contextId', function() {
    it('should be the context ID passed to the constructor', function() {
      var brandId = 4985,
          brandOrders = new Orders('brand', brandId),
          programId = 309248,
          programOrders = new Orders('program', programId);

      expect(brandOrders.contextId).to.be.a('number').and.to.equal(brandId);
      expect(programOrders.contextId).to.be.a('number').and.to.equal(programId);
    });
  });

  describe('getAll()', function() {
    it('should return an array to the callback', function(done) {
      var programOrders = new Orders('program', 67);

      programOrders.getAll(function(error, data) {
        expect(data).to.be.an('array');

        done();
      });
    });
  });

  describe('get()', function() {
    it('should return an object to the callback', function(done) {
      var brandOrders = new Orders('brand', 3209);

      brandOrders.get(1654, function(error, data) {
        expect(error).to.equal(null);

        expect(data).to.be.an('object');

        done();
      });
    });
  });

  describe('create()', function() {
    it('should return an object to the callback', function(done) {
      var programOrders = new Orders('program', 2994);

      programOrders.create({}, function(error, response) {
        expect(error).to.equal(null);

        expect(response).to.be.an('object');

        done();
      });
    });
  });
});

