'use strict';

var chai    = require('chai'),
    expect  = chai.expect,
    sinon   = require('sinon'),
    RO      = require('../');

describe('RO.program()', function() {
  it('should return an object', function() {
    var program = RO.program(1);

    expect(program).to.be.an('object');
  });

  describe('id', function() {
    it('should be the number passed as an argument to ro.program()', function() {
      var id = Math.floor(Math.random() * (1000000 - 1)) + 1,
          program = RO.program(id);

      expect(program.id).to.be.a('number').and.to.equal(id);
    });
  });

  describe('details()', function() {
    it('should be an alias for ro.programs.get(program.id)', function(done) {
      // A random integer, per
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
      var id = Math.floor(Math.random() * (1000000 - 1)) + 1,
          program = RO.program(id);

      sinon.spy(RO.programs, 'get').withArgs(id);

      program.details(function() {
        expect(RO.programs.get.calledWith(id)).to.equal(true);

        RO.programs.get.restore();

        done();
      });
    });
  });

  describe('orders', function() {
    var id = 33,
        program = RO.program(id);

    it('should be an object', function() {
      expect(program.orders).to.be.an('object');
    });

    it('should have the correct context ID', function() {
      expect(program.orders.contextId).to.equal(id);
    });

    it('should have the correct context', function() {
      expect(program.orders.context).to.equal('program');
    });

    describe('getAll()', function() {
      it('should return an array to the callback', function(done) {
        program.orders.getAll(function(error, data) {
          expect(data).to.be.an('array');

          done();
        });
      });
    });

    describe('get()', function() {
      it('should return an object to the callback', function(done) {
        program.orders.get(1654, function(error, data) {
          expect(error).to.equal(null);

          expect(data).to.be.an('object');

          done();
        });
      });
    });

    describe('create()', function() {
      it('should return an object to the callback', function(done) {
        program.orders.create({}, function(error, response) {
          expect(error).to.equal(null);

          expect(response).to.be.an('object');

          done();
        });
      });
    });
  });
});

