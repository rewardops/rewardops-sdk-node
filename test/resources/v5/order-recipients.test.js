const faker = require('faker');
const nock = require('nock');

const RO = require('../../..');
const orderRecipients = require('../../../lib/resources/order-recipients');
const { setPiiToken } = require('../../../lib/utils/axios-helpers');
const { ConfigurationError } = require('../../../lib/utils/error');
const { mockConfig } = require('../../test-helpers/mock-config');

jest.mock('../../../lib/utils/axios-helpers');
setPiiToken.mockResolvedValue();

const mockCallBack = jest.fn();
const mockPiiServerUrl = faker.internet.url();
const mockProgramId = faker.random.number();
const mockProgramCode = faker.random.word();
const testError = { error: 'testError' };
const mockOrderRecipientCode = '011a0032-162f-497d-9856-b9b7a9fb31b8';

describe('v5 order-recipients', () => {
  let orderRecipient;

  beforeEach(() => {
    RO.config.init(
      mockConfig({
        supportedLocales: ['en-CA', 'fr-CA'],
        piiServerUrl: mockPiiServerUrl,
      })
    );
    orderRecipient = orderRecipients.orderRecipientFactory('programs', mockProgramId, mockProgramCode);
  });

  afterEach(() => {
    RO.config.reset();
    jest.clearAllMocks();
  });

  it('throws an error if not provided a `programs` context', () => {
    const missingProgramsContext = () =>
      orderRecipients.orderRecipientFactory('something else', mockProgramId, mockProgramCode);
    expect(missingProgramsContext).toThrow(ConfigurationError);
    expect(missingProgramsContext).toThrow('Can only create an order recipient object for programs');
  });

  describe('when piiServerUrl not configured', () => {
    beforeEach(() => {
      RO.config.reset();
      RO.config.init(
        mockConfig({
          piiServerUrl: null,
          supportedLocales: [],
        })
      );
    });

    it('should respond with an error', () => {
      const missingPiiServerUrl = () =>
        orderRecipients.orderRecipientFactory('programs', mockProgramId, mockProgramCode);
      expect(missingPiiServerUrl).toThrow(ConfigurationError);
      expect(missingPiiServerUrl).toThrow('`piiServerUrl` is not configured');
    });
  });

  describe('when supportedLocales not configured', () => {
    beforeEach(() => {
      RO.config.reset();
      RO.config.init(
        mockConfig({
          supportedLocales: undefined,
        })
      );
    });

    it('should respond with an error', () => {
      const missingSupportedLocales = () =>
        orderRecipients.orderRecipientFactory('programs', mockProgramId, mockProgramCode);
      expect(missingSupportedLocales).toThrow(ConfigurationError);
      expect(missingSupportedLocales).toThrow('`supportedLocales` is not configured');
    });
  });

  describe('when configured', () => {
    /** Minimal Member props */
    const member = { id: faker.random.number(), accept_language: 'en-CA' };

    const mockStoreOrderRecipientResponse = {
      mockOrderRecipientCode,
      validation_signature: `${faker.random.uuid()}FA==`,
    };

    const mockStoreOrderRecipientCall = () =>
      nock(mockPiiServerUrl).post(`/api/v5/programs/${mockProgramCode}/order_recipients`, member);

    const mockCreateOrderCall = () =>
      nock(mockPiiServerUrl).post(`/api/v4/programs/${mockProgramId}/orders`, {
        ...mockStoreOrderRecipientResponse,
        amount: 100,
      });

    describe('#storeOrderRecipient', () => {
      it('should return props from `storeOrderRecipient` when it receives a 200', async () => {
        mockStoreOrderRecipientCall().reply(200, {
          result: mockStoreOrderRecipientResponse,
        });

        const orderRecipientData = await orderRecipients.storeOrderRecipient({ programCode: mockProgramCode })(member);

        expect(orderRecipientData).toEqual(mockStoreOrderRecipientResponse);
      });
    });

    describe('#create', () => {
      it('should respond with an error if the request params are empty', async () => {
        const requestBody = {};

        await orderRecipient.create(requestBody, mockCallBack);

        expect(mockCallBack).toHaveBeenCalledWith(['accept_language is a required field']);
      });

      it('should return the error to the callback if an error occurs during auth', async () => {
        setPiiToken.mockRejectedValueOnce('testError');

        await orderRecipient.create({ member }, mockCallBack);

        expect(mockCallBack).toBeCalledWith(testError);
      });

      it('should return the error to the callback if an error occurs during store order recipient', async () => {
        mockStoreOrderRecipientCall().reply(422, testError);

        await orderRecipient.create({ member }, mockCallBack);

        expect(mockCallBack).toBeCalledWith({ error: expect.objectContaining({ status: 422, data: testError }) });
      });

      it('should return the error to the callback if an error occurs during order create', async () => {
        mockStoreOrderRecipientCall().reply(200, {
          result: mockStoreOrderRecipientResponse,
        });

        mockCreateOrderCall().reply(422, testError);

        await orderRecipient.create({ member, amount: 100 }, mockCallBack);

        expect(mockCallBack).toBeCalledWith(testError);
      });

      it('should return the response to the callback if the create was successful', async () => {
        mockStoreOrderRecipientCall().reply(200, {
          result: mockStoreOrderRecipientResponse,
        });

        mockCreateOrderCall().reply(200, { result: 'testData' });

        await orderRecipient.create({ member, amount: 100 }, mockCallBack);
        // PII create order should have the same callback signature as orders#create
        expect(mockCallBack).toBeCalledWith(null, 'testData', { result: 'testData' });
      });
    });
  });

  describe('#getOrderRecipient', () => {
    it('should return the error to the callback if an error occurs during auth', async () => {
      setPiiToken.mockRejectedValueOnce('testError');

      await orderRecipient.getOrderRecipient(mockOrderRecipientCode, mockCallBack);

      expect(mockCallBack).toBeCalledWith('testError');
    });

    it('should respond with an error if the params are invalid', async () => {
      nock(mockPiiServerUrl)
        .get(`/api/v5/programs/${mockProgramCode}/order_recipients/${mockOrderRecipientCode}`)
        .reply(200, { foo: 'bar', result: 42 });

      await orderRecipient.getOrderRecipient(mockOrderRecipientCode, mockCallBack);

      expect(mockCallBack).toHaveBeenCalledWith(null, 42, { foo: 'bar', result: 42 });
    });
  });
});
