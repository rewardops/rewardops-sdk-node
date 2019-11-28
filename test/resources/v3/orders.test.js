const RO = require('../../..');

describe('v3 orders', () => {
  beforeAll(() => {
    RO.config.set('apiVersion', 'v3');
    RO.config.set('verbose', false);
  });

  afterAll(() => {
    RO.config.reset();
  });

  describe('contextId', () => {
    it('should be the context ID passed to the constructor', () => {
      const programId = 309248;
      const programOrders = RO.program(programId).orders;

      expect(programOrders.contextId).toEqual(programId);
    });
  });
});
