'use strict';

var chai    = require('chai'),
    assert  = chai.assert,
    context = require('../lib/context');

describe('context', function() {
  describe('contextType', function() {
    it('should create a brands object', function() {
      var brands = context.contextType('brands');

      assert.typeOf(brands, 'object');
    });

    it('should create a programs object', function() {
      var programs = context.contextType('programs');

      assert.typeOf(programs, 'object');
    });

    it('should create a suppliers object', function() {
      var suppliers = context.contextType('suppliers');

      assert.typeOf(suppliers, 'object');
    });

    it('should create an object with the correct context property', function() {
      var brands = context.contextType('brands'),
          foos = context.contextType('foos');

      assert.equal(brands.context, 'brands');
      assert.equal(foos.context, 'foos');
    });
  });
  describe('contextInstance', function() {
    it('should create a programs object', function() {
      var program = context.contextInstance('programs');

      assert.typeOf(program, 'object');
    });

    it('should create an object with the corrext contextTypeName and id attributes, and an orders object', function() {
      var program = context.contextInstance('programs', 33);

      assert.equal(program.contextTypeName, 'programs');
      assert.equal(program.id, 33);
      assert.typeOf(program.orders, 'object');
    });
  });
});

