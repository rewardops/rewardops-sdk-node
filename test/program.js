'use strict';

var chai      = require('chai'),
    assert    = chai.assert,
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

    assert.instanceOf(program1, Error);
    assert.equal(program1.message, 'Program ID must be a number');

    assert.instanceOf(program2, Error);
    assert.equal(program2.message, 'Program ID must be a number');
  });

  it('should return an object', function() {
    var program = RO.program(1);

    assert.typeOf(program, 'object');
  });

  describe('id', function() {
    it('should be the number passed as an argument to ro.program()', function() {
      var id = Math.floor(Math.random() * (1000000 - 1)) + 1,
          program = RO.program(id);

      assert.typeOf(program.id, 'number');
      assert.equal(program.id, id);
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
        assert.equal(RO.programs.get.calledWith(id), true);

        RO.programs.get.restore();

        done();
      });
    });
  });
});

