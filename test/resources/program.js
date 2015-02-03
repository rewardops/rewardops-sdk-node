'use strict';

var chai      = require('chai'),
    expect    = chai.expect,
    sinon     = require('sinon'),
    Program   = require('../../lib/resources/program.js'),
    Orders    = require('../../lib/resources/orders.js'),
    programs  = require('../../lib/resources/programs.js');

describe('Program', function() {
  it('should create an object', function() {
    var program = new Program(1);

    expect(program.constructor).to.equal(Program);
  });

  describe('id', function() {
    it('should be the number passed as an argument to ro.program()', function() {
      var id = Math.floor(Math.random() * (1000000 - 1)) + 1,
          program = new Program(id);

      expect(program.id).to.be.a('number').and.to.equal(id);
    });
  });

  describe('details()', function() {
    it('should be an alias for ro.programs.get(program.id)', function(done) {
      // A random integer, per
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
      var id = Math.floor(Math.random() * (1000000 - 1)) + 1,
          program = new Program(id);

      sinon.spy(programs, 'get').withArgs(id);

      program.details(function() {
        expect(programs.get.calledWith(id)).to.equal(true);

        programs.get.restore();

        done();
      });
    });
  });

  describe('orders', function() {
    var id = 33,
        program = new Program(id);

    it('should be an instance of ProgramOrders', function() {
      expect(program.orders).to.be.an.instanceof(Orders);
    });

    it('should have the correct context ID', function() {
      expect(program.orders.contextId).to.equal(id);
    });

    it('should have the correct context', function() {
      expect(program.orders.context).to.equal('program');
    });
  });
});

