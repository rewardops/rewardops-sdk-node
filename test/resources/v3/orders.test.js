const RO = require('../../..');

describe('v3 orders', function() {
  beforeAll(function() {
    RO.config.set('apiVersion', 'v3');
  });

  afterAll(function() {
    RO.config.reset();
  });

  describe('contextId', function() {
    it('should be the context ID passed to the constructor', function() {
      const programId = 309248;
      const programOrders = RO.program(programId).orders;

      expect(programOrders.contextId).toEqual(programId);
    });
  });
});
