'use strict';

var context = require('../lib/context');

describe('context', function() {
  describe('contextType', function() {
    it('should create a brands object', function() {
      var brands = context.contextType('brands');

      expect(typeof brands).toBe('object');
    });

    it('should create a programs object', function() {
      var programs = context.contextType('programs');

      expect(typeof programs).toBe('object');
    });

    it('should create a suppliers object', function() {
      var suppliers = context.contextType('suppliers');

      expect(typeof suppliers).toBe('object');
    });

    it('should create an object with the correct context property', function() {
      var brands = context.contextType('brands'),
          foos = context.contextType('foos');

      expect(brands.context).toEqual('brands');
      expect(foos.context).toEqual('foos');
    });
  });
  describe('contextInstance', function() {
    it('should create a programs object', function() {
      var program = context.contextInstance('programs');

      expect(typeof program).toBe('object');
    });

    it('should create an object with the corrext contextTypeName and id attributes, and an orders object', function() {
      var program = context.contextInstance('programs', 33);

      expect(program.contextTypeName).toEqual('programs');
      expect(program.id).toEqual(33);
      expect(typeof program.orders).toBe('object');
    });
  });
});

