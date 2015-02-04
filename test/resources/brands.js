'use strict';

var chai    = require('chai'),
    expect  = chai.expect,
    RO      = require('../..');

describe('brands', function() {
  it('should be an object', function() {
    expect(RO.brands).to.be.an('object');
  });

  describe('getAll()', function() {
    it('should return an array', function(done) {
      RO.brands.getAll(function(error, brandList) {
        expect(error).to.equal(null);

        expect(brandList).to.be.an('array');

        done();
      });
    });
  });

  describe('get()', function() {
    it('should return an object', function(done) {
      var id = 555;

      RO.brands.get(id, function(error, data) {
        expect(error).to.equal(null);

        expect(data).to.be.an('object');

        done();
      });
    });
  });
});

