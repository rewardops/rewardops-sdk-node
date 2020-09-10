const faker = require('faker');

const { storeOrderRecipient } = require('../../../lib/resources/order-recipients');
const RO = require('../../..');

const mockApiClient = { post: jest.fn() };
const mockCallBack = jest.fn();
const mockPiiServerUrl = faker.internet.url();
const mockProgramCode = faker.random.number();

describe('v5 order-recipients', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('default (not configured)', () => {
    describe('storeOrderRecipient', () => {
      it('should respond with an error if there is a bad config', async () => {
        const requestBody = {};

        await expect(
          storeOrderRecipient({ orderContext: { programCode: mockProgramCode }, apiClient: mockApiClient })(
            requestBody,
            mockCallBack
          )
        ).rejects.toThrowError('piiServerUrl is not configured');
      });
    });
  });

  describe('configured', () => {
    beforeEach(() => {
      RO.config.set('piiServerUrl', mockPiiServerUrl);
    });

    afterEach(() => {
      RO.config.reset();
    });

    describe('storeOrderRecipient', () => {
      it('should contain the piiServerUrl in the request URL', async () => {
        const requestBody = { id: 1, accept_language: 'en-CA' };

        await storeOrderRecipient({ orderContext: { programCode: mockProgramCode }, apiClient: mockApiClient })(
          requestBody,
          mockCallBack
        );

        expect(mockApiClient.post).toHaveBeenCalledWith(
          {
            path: `/${mockPiiServerUrl}/api/v5/programs/${mockProgramCode}/order_recipients`,
            requestBody,
          },
          expect.any(Function)
        );
      });

      it('should respond with an error if the params are invalid', async () => {
        const requestBody = {};

        await storeOrderRecipient({ orderContext: { programCode: mockProgramCode }, apiClient: mockApiClient })(
          requestBody,
          mockCallBack
        );

        expect(mockCallBack).toHaveBeenCalledWith(expect.any(Array));
        expect(mockApiClient.post).not.toHaveBeenCalled();
      });
    });
  });
});
