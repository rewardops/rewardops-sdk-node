const faker = require('faker');

const orderRecipientFactory = require('../../../lib/resources/order-recipients');
const RO = require('../../..');

const mockApiClient = { post: jest.fn() };
const mockCallBack = jest.fn();
const mockPiiServerUrl = faker.internet.url();
const mockProgramCode = faker.random.number();

describe('v5 order-recipients', () => {
  let orderRecipient;

  beforeEach(() => {
    orderRecipient = orderRecipientFactory('programs', mockProgramCode, mockApiClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if not provided a `programs` context', () => {
    expect(() => {
      orderRecipientFactory('something else', mockProgramCode, mockApiClient);
    }).toThrow(Error('Can only create an order recipient object for programs'));
  });

  describe('when default (not configured)', () => {
    describe('#storeOrderRecipient', () => {
      it('should respond with an error if there is a bad config', async () => {
        const requestBody = {};

        await expect(orderRecipient.store(requestBody, mockCallBack)).rejects.toThrowError(
          'piiServerUrl is not configured'
        );
      });
    });
  });

  describe('when configured', () => {
    beforeEach(() => {
      RO.config.set('piiServerUrl', mockPiiServerUrl);
    });

    afterEach(() => {
      RO.config.reset();
    });

    describe('#storeOrderRecipient', () => {
      it('should contain the piiServerUrl in the request URL', async () => {
        const requestBody = { id: 1, accept_language: 'en-CA' };

        await orderRecipient.store(requestBody, mockCallBack);

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

        await orderRecipient.store(requestBody, mockCallBack);

        expect(mockCallBack).toHaveBeenCalledWith(expect.any(Array));
        expect(mockApiClient.post).not.toHaveBeenCalled();
      });
    });
  });
});
