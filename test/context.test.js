const context = require('../lib/context');

describe('context', () => {
  describe('contextType', () => {
    it('should create a brands object', () => {
      const brands = context.contextType('brands');

      expect(typeof brands).toBe('object');
    });

    it('should create a programs object', () => {
      const programs = context.contextType('programs');

      expect(typeof programs).toBe('object');
    });

    it('should create a suppliers object', () => {
      const suppliers = context.contextType('suppliers');

      expect(typeof suppliers).toBe('object');
    });

    it('should create an object with the correct context property', () => {
      const brands = context.contextType('brands');
      const foos = context.contextType('foos');

      expect(brands.context).toEqual('brands');
      expect(foos.context).toEqual('foos');
    });
  });
  describe('contextInstance', () => {
    it('should create a programs object', () => {
      const program = context.contextInstance('programs');

      expect(typeof program).toBe('object');
    });

    it('should create an object with the corrext contextTypeName and id attributes, and an orders object', () => {
      const program = context.contextInstance('programs', 33);

      expect(program.contextTypeName).toEqual('programs');
      expect(program.id).toEqual(33);
      expect(typeof program.orders).toBe('object');
    });
  });
});
