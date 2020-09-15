const faker = require('faker');
const axios = require('axios');

const orderRecipientFactory = require('../../../lib/resources/order-recipients');
const RO = require('../../..');

jest.mock('axios');

const mockCallBack = jest.fn();
const mockPiiServerUrl = faker.internet.url();
const mockProgramId = faker.random.number();
const mockProgramCode = faker.random.word();

// TODO: add additional tests
// see: https://rewardops.atlassian.net/browse/MX-1064
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

  describe('when piiServerUrl (not configured)', () => {
    beforeEach(() => {
      RO.config.set('piiServerUrl', undefined);
    });

    it('should respond with an error if there is a bad config', () => {
      expect(() => orderRecipientFactory('programs', mockProgramId, mockProgramCode)).toThrow(
        'piiServerUrl is not configured'
      );
    });
  });

  describe('when supportedLocales (not configured)', () => {
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
    describe('#storeOrderRecipient', () => {
      it('should contain the piiServerUrl in the request URL', async () => {
        const member = { id: faker.random.number(), accept_language: 'en-CA' };

        await orderRecipient.create({ member }, mockCallBack);

        expect(axios.post).toHaveBeenNthCalledWith(
          1,
          `${RO.config.get('piiServerUrl')}/api/v5/auth/token`,
          { grant_type: 'client_credentials' },
          {
            auth: {
              username: RO.config.get('clientId'),
              password: RO.config.get('clientSecret'),
            },
          }
        );
      });

      it('should respond with an error if the params are invalid', async () => {
        const requestBody = {};

        await orderRecipient.create(requestBody, mockCallBack);

        expect(mockCallBack).toHaveBeenCalledWith(['accept_language is a required field']);
      });
    });
  });
});
