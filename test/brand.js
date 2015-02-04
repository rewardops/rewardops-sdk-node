'use strict';

var chai    = require('chai'),
    expect  = chai.expect,
    sinon   = require('sinon'),
    RO      = require('../');

describe('RO.brand()', function() {
  it('should return an object', function() {
    var brand = RO.brand(1);

    expect(brand).to.be.an('object');
  });

  describe('id', function() {
    it('should be the number passed as an argument to ro.brand()', function() {
      var id = Math.floor(Math.random() * (1000000 - 1)) + 1,
          brand = RO.brand(id);

      expect(brand.id).to.be.a('number').and.to.equal(id);
    });
  });

  describe('details()', function() {
    it('should be an alias for ro.brands.get(brand.id)', function(done) {
      // A random integer, per
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
      var id = Math.floor(Math.random() * (1000000 - 1)) + 1,
          brand = RO.brand(id);

      sinon.spy(RO.brands, 'get').withArgs(id);

      brand.details(function() {
        expect(RO.brands.get.calledWith(id)).to.equal(true);

        RO.brands.get.restore();

        done();
      });
    });
  });

  describe('orders', function() {
    var id = 33,
        brand = RO.brand(id);

    it('should be an object', function() {
      expect(brand.orders).to.be.an('object');
    });

    it('should have the correct context ID', function() {
      expect(brand.orders.contextId).to.equal(id);
    });

    it('should have the correct context', function() {
      expect(brand.orders.context).to.equal('brand');
    });

    describe('getAll()', function() {
      it('should return an array to the callback', function(done) {
        brand.orders.getAll(function(error, data) {
          expect(data).to.be.an('array');

          done();
        });
      });
    });

    describe('get()', function() {
      it('should return an object to the callback', function(done) {
        brand.orders.get(1654, function(error, data) {
          expect(error).to.equal(null);

          expect(data).to.be.an('object');

          done();
        });
      });
    });

    describe('create()', function() {
      it('should return an object to the callback', function(done) {
        brand.orders.create({}, function(error, response) {
          expect(error).to.equal(null);

          expect(response).to.be.an('object');

          done();
        });
      });
    });

    describe('update()', function() {
      it('should return an object to the callback', function(done) {
        brand.orders.update(377, {}, function(error, response) {
          expect(error).to.equal(null);

          expect(response).to.be.an('object');

          done();
        });
      });
    });
  });
});

