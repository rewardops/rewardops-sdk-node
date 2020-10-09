const RO = require('../../..');
const { mockConfig } = require('../../test-helpers/mock-config');

describe('v3 orders', () => {
  beforeAll(() => {
    RO.config.init(mockConfig({ apiVersion: 'v3', piiServerUrl: null, verbose: false }));
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
