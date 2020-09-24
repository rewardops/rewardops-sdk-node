const faker = require('faker');
const nock = require('nock');

const orderRecipientFactory = require('../../../lib/resources/order-recipients');
const RO = require('../../..');
const { setV5Token } = require('../../../lib/utils/axios-helpers');

jest.mock('../../../lib/utils/axios-helpers');

setV5Token.mockResolvedValue();

const mockCallBack = jest.fn();
const mockPiiServerUrl = faker.internet.url();
const mockProgramId = faker.random.number();
const mockProgramCode = faker.random.word();
const testError = { error: 'testError' };
const mockOrderRecipientCode = '011a0032-162f-497d-9856-b9b7a9fb31b8';

describe('v5 order-recipients', () => {
  let orderRecipient;

  beforeEach(() => {
    RO.config.set('piiServerUrl', mockPiiServerUrl);
    RO.config.set('supportedLocales', ['en-CA', 'fr-CA']);
    orderRecipient = orderRecipientFactory('programs', mockProgramId, mockProgramCode);
  });

  afterEach(() => {
    RO.config.reset();
    jest.clearAllMocks();
  });

  it('throws an error if not provided a `programs` context', () => {
    expect(() => orderRecipientFactory('something else', mockProgramId, mockProgramCode)).toThrow(
      'Can only create an order recipient object for programs'
    );
  });

  describe('when piiServerUrl not configured', () => {
    beforeEach(() => {
      RO.config.set('piiServerUrl', undefined);
    });

    it('should respond with an error if there is a bad config', () => {
      expect(() => orderRecipientFactory('programs', mockProgramId, mockProgramCode)).toThrow(
        'piiServerUrl is not configured'
      );
    });
  });

  describe('when supportedLocales not configured', () => {
    beforeEach(() => {
      RO.config.set('supportedLocales', undefined);
    });

    it('should respond with an error if there is a bad config', () => {
      expect(() => orderRecipientFactory('programs', mockProgramId, mockProgramCode)).toThrow(
        'supportedLocales is not configured'
      );
    });
  });

  describe('when configured', () => {
    const member = { id: faker.random.number(), accept_language: 'en-CA' };
    const mockOrderRecipient = {
      mockOrderRecipientCode,
      validation_signature: `${faker.random.uuid()}FA==`,
    };
    const mockStoreOrderRecipient = () =>
      nock(mockPiiServerUrl).post(`/api/v5/programs/${mockProgramCode}/order_recipients`, member);
    const mockCreateOrder = () =>
      nock(mockPiiServerUrl).post(`/api/v4/programs/${mockProgramId}/orders`, { amount: 100 });

    describe('#create', () => {
      it('should respond with an error if the params are invalid', async () => {
        const requestBody = {};

        await orderRecipient.create(requestBody, mockCallBack);

        expect(mockCallBack).toHaveBeenCalledWith(['accept_language is a required field']);
      });

      it('should return the error to the callback if an error occurs during auth', async () => {
        setV5Token.mockRejectedValueOnce('testError');

        await orderRecipient.create({ member }, mockCallBack);

        expect(mockCallBack).toBeCalledWith(testError);
      });

      it('should return the error to the callback if an error occurs during store order recipient', async () => {
        mockStoreOrderRecipient().reply(422, testError);

        await orderRecipient.create({ member }, mockCallBack);

        expect(mockCallBack).toBeCalledWith({ error: testError });
      });

      it('should return the error to the callback if an error occurs during order create', async () => {
        mockStoreOrderRecipient().reply(200, {
          result: mockOrderRecipient,
        });

        mockCreateOrder().reply(422, testError);

        await orderRecipient.create({ member, amount: 100 }, mockCallBack);

        expect(mockCallBack).toBeCalledWith(testError);
      });

      it('should return the response to the callback if the create was successful', async () => {
        mockStoreOrderRecipient().reply(200, {
          result: mockOrderRecipient,
        });

        mockCreateOrder().reply(200, { result: 'ok' });

        await orderRecipient.create({ member, amount: 100 }, mockCallBack);

        expect(mockCallBack).toBeCalledWith(null, { result: 'ok' }, expect.any(Object));
      });
    });
  });

  describe('#getOrderRecipient', () => {
    it('should return the error to the callback if an error occurs during auth', async () => {
      setV5Token.mockRejectedValueOnce('testError');

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
