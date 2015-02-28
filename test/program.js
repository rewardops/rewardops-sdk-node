'use strict';

var chai      = require('chai'),
    expect    = chai.expect,
    sinon     = require('sinon'),
    RO        = require('../'),
    fixtures  = require('./fixtures/programFixtures');

describe('RO.program()', function() {
  /* jshint camelcase: false */

  before(function() {
    fixtures();
  });

  it('should return an error when passed with a non-number', function() {
    var program1 = RO.program('1'),
        program2 = RO.program([]);

    expect(program1).to.be.an.instanceOf(Error);
    expect(program1.message).to.equal('Program ID must be a number');

    expect(program2).to.be.an.instanceOf(Error);
    expect(program2.message).to.equal('Program ID must be a number');
  });

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
});

