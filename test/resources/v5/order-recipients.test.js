const faker = require('faker');
const nock = require('nock');
const axios = require('axios');

const RO = require('../../..');
const { ordersClient, ...orderRecipients } = require('../../../lib/resources/order-recipients');
const { setPiiToken } = require('../../../lib/utils/axios-helpers');
const { SDKError } = require('../../../lib/utils/error');
const { mockConfig } = require('../../test-helpers/mock-config');

jest.mock('../../../lib/utils/axios-helpers');
setPiiToken.mockResolvedValue();

const mockCallBack = jest.fn();
const mockPiiServerUrl = faker.internet.url();
const mockProgramId = faker.random.number();
const mockProgramCode = faker.random.word();
const testError = { error: 'testError' };
const mockOrderRecipientCode = faker.random.uuid();

/**
 * This helper simulates middleware that you may use to inject headers into requests e.g. Data Dog
 *
 * @param {object} client Axios instance
 * @param {string} httpMethod Any valid http method e.g. 'post', 'get'
 * @param {object} [headers] Headers to be injected to the request object
 *
 * @example simulateHeaderInjection(testClient, 'post') // void
 */
const simulateHeaderInjection = (client, httpMethod, headers = { 'X-Custom-Header': 'foobar' }) => {
  jest.spyOn(client, httpMethod).mockImplementation((...params) => {
    const instance = axios.create({ headers });

    return instance[httpMethod](...params);
  });
};

describe('v5 order-recipients', () => {
  let orderRecipient;

  afterEach(() => {
    jest.clearAllMocks();
    RO.config.reset();
  });

  describe('error handling', () => {
    it('responds with an error when `piiServerUrl` not configured', () => {
      RO.config.init(
        mockConfig({
          supportedLocales: [],
        })
      );

      const missingPiiServerUrl = () =>
        orderRecipients.orderRecipientFactory('programs', mockProgramId, mockProgramCode);

      expect(missingPiiServerUrl).toThrow(SDKError);
      expect(missingPiiServerUrl).toThrow('`piiServerUrl` is not configured');
    });

    it('responds with an error when `supportedLocales` not configured', () => {
      RO.config.init(
        mockConfig({
          piiServerUrl: faker.internet.url(),
          supportedLocales: undefined,
        })
      );

      const missingSupportedLocales = () =>
        orderRecipients.orderRecipientFactory('programs', mockProgramId, mockProgramCode);

      expect(missingSupportedLocales).toThrow(SDKError);
      expect(missingSupportedLocales).toThrow('`supportedLocales` is not configured');
    });

    it('throws an error if not provided a `programs` context', () => {
      RO.config.init(
        mockConfig({
          supportedLocales: ['en-CA', 'fr-CA'],
          piiServerUrl: mockPiiServerUrl,
        })
      );

      const missingProgramsContext = () =>
        orderRecipients.orderRecipientFactory('invalid-context', mockProgramId, mockProgramCode);

      expect(missingProgramsContext).toThrow(SDKError);
      expect(missingProgramsContext).toThrow('Can only create an order recipient object for programs');
    });
  });

  describe('when configured', () => {
    /** Minimal Member props */
    const member = { id: faker.random.number(), accept_language: 'en-CA' };

    const mockStoreOrderRecipientResponse = {
      mockOrderRecipientCode,
      validation_signature: `${faker.random.uuid()}FA==`,
    };

    const mockPiiConfig = mockConfig({
      supportedLocales: ['en-CA', 'fr-CA'],
      piiServerUrl: mockPiiServerUrl,
    });

    const mockStoreOrderRecipientCall = () =>
      nock(mockPiiConfig.piiServerUrl).post(`/api/v5/programs/${mockProgramCode}/order_recipients`, member);

    const mockCreateOrderCall = () =>
      nock(mockPiiConfig.apiServerUrl).post(`/api/v4/programs/${mockProgramId}/orders`, {
        ...mockStoreOrderRecipientResponse,
        amount: 100,
      });

    beforeEach(() => {
      RO.config.init(mockPiiConfig);

      orderRecipient = orderRecipients.orderRecipientFactory('programs', mockProgramId, mockProgramCode);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    describe('#storeOrderRecipient', () => {
      it('call to PII server URL and returns props from `storeOrderRecipient` when it receives a 200', async () => {
        const call = mockStoreOrderRecipientCall().reply(200, {
          result: mockStoreOrderRecipientResponse,
        });

        const orderRecipientData = await orderRecipients.storeOrderRecipient({ programCode: mockProgramCode })(member);

        expect(call.isDone()).toBe(true);
        expect(orderRecipientData).toEqual(mockStoreOrderRecipientResponse);
      });
    });

    describe('#create', () => {
      describe('error handling', () => {
        it('responds with an error if the request params are empty', async () => {
          const requestBody = {};

          await orderRecipient.create(requestBody, mockCallBack);

          expect(mockCallBack).toHaveBeenCalledWith(['accept_language is a required field']);
        });

        it('returns the error to the callback if an error occurs during auth', async () => {
          setPiiToken.mockRejectedValueOnce('testError');

          await orderRecipient.create({ member }, mockCallBack);

          expect(mockCallBack).toBeCalledWith(testError);
        });

        it('returns the error to the callback if an error occurs during store order recipient', async () => {
          mockStoreOrderRecipientCall().reply(422, testError);

          await orderRecipient.create({ member }, mockCallBack);

          expect(mockCallBack).toBeCalledWith({ error: expect.objectContaining({ status: 422, data: testError }) });
        });

        it('returns the error to the callback if an error occurs during order create', async () => {
          mockStoreOrderRecipientCall().reply(200, {
            result: mockStoreOrderRecipientResponse,
          });

          mockCreateOrderCall().reply(422, testError);

          await orderRecipient.create({ member, amount: 100 }, mockCallBack);

          expect(mockCallBack).toBeCalledWith(testError);
        });
      });

      describe('Successful order creation', () => {
        let createOrderCall = () => {};

        beforeEach(() => {
          mockStoreOrderRecipientCall().reply(200, {
            result: mockStoreOrderRecipientResponse,
          });

          createOrderCall = mockCreateOrderCall().reply(200, { result: 'testData' });
        });

        it('calls API server URL and returns the response to the callback if the create was successful', async () => {
          await orderRecipient.create({ member, amount: 100 }, mockCallBack);

          expect(createOrderCall.isDone()).toBe(true);

          // NOTE: PII create order should have the same callback signature as orders#create
          expect(mockCallBack).toBeCalledWith(
            null,
            'testData',
            { result: 'testData' },
            expect.objectContaining({ headers: expect.not.objectContaining({ 'x-custom-header': 'foobar' }) })
          );
        });

        it('returns any injected headers to the callback', async () => {
          // We want to simulate custom headers being injected into the request
          simulateHeaderInjection(ordersClient, 'post');

          await orderRecipient.create({ member, amount: 100 }, mockCallBack);

          expect(createOrderCall.isDone()).toBe(true);

          expect(mockCallBack).toBeCalledWith(
            null,
            'testData',
            { result: 'testData' },
            // Assert that the request headers are returned
            expect.objectContaining({ headers: expect.objectContaining({ 'x-custom-header': 'foobar' }) })
          );
        });
      });
    });
  });

  describe('#getOrderRecipient', () => {
    beforeEach(() => {
      RO.config.init(
        mockConfig({
          supportedLocales: ['en-CA', 'fr-CA'],
          piiServerUrl: mockPiiServerUrl,
        })
      );

      orderRecipient = orderRecipients.orderRecipientFactory('programs', mockProgramId, mockProgramCode);
    });

    it('returns the error to the callback if an error occurs during auth', async () => {
      setPiiToken.mockRejectedValueOnce('testError');

      await orderRecipient.getOrderRecipient(mockOrderRecipientCode, mockCallBack);

      expect(mockCallBack).toBeCalledWith('testError');
    });

    describe('Successful GET order recipient', () => {
      let call = () => {};

      beforeEach(() => {
        call = nock(mockPiiServerUrl)
          .get(`/api/v5/programs/${mockProgramCode}/order_recipients/${mockOrderRecipientCode}`)
          .reply(200, { foo: 'bar', result: 42 });
      });

      it('calls PII server URL and returns the response to the callback if call was successful', async () => {
        await orderRecipient.getOrderRecipient(mockOrderRecipientCode, mockCallBack);

        expect(call.isDone()).toBe(true);
        expect(mockCallBack).toHaveBeenCalledWith(
          null,
          42,
          { foo: 'bar', result: 42 },
          expect.objectContaining({
            headers: expect.not.objectContaining({ 'x-custom-header': 'foobar' }),
          })
        );
      });

      it('returns injected headers to the callback', async () => {
        // We want to simulate custom headers being injected into the request
        simulateHeaderInjection(ordersClient, 'get');

        await orderRecipient.getOrderRecipient(mockOrderRecipientCode, mockCallBack);

        expect(call.isDone()).toBe(true);
        expect(mockCallBack).toHaveBeenCalledWith(
          null,
          42,
          { foo: 'bar', result: 42 },
          expect.objectContaining({
            headers: expect.objectContaining({ 'x-custom-header': 'foobar' }),
          })
        );
      });
    });
  });
});
