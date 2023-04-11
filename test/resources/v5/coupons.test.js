const nock = require('nock');
const RO = require('../../..');
const fixtures = require('../../fixtures/v5/coupons.fixtures');
const { mockConfig } = require('../../test-helpers/mock-config');
const { CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN } = require('../../fixtures/v5/credentials');

RO.config.init(
  mockConfig({
    apiVersion: 'v5',
    piiServerUrl: null,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  })
);

describe('v5', () => {
  beforeAll(() => {
    fixtures();
  });

  afterAll(() => {
    RO.config.reset();
  });

  describe('coupons', () => {
    const { coupons } = RO;

    describe('postValidate()', () => {
      it('should pass an object to the callback', () => {
        return new Promise(done => {
          nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          })
            .post('/coupon_preflight')
            .reply(200, {
              result: { status: 'OK', result: {} },
            });

          coupons.postValidate(
            {
              owner_type: 'program',
              owner_code: 'am',
              coupon_code: 'PRE-WGQY-7DSE',
              external_member_id: '21dasd',
              items: [
                {
                  item_order_token: 'LVYR3nigGjsiWOkOwEmh5NhM_5Sd4C5Wn3-8BOipw9M=',
                  quantity: 1,
                },
                {
                  item_order_token: 'u5W97OqfDi-GknQEHFGQQYwTPZ0DcT4WCDAiiZsEP3M=',
                  quantity: 2,
                },
              ],
            },
            (error, data) => {
              expect(error).toBeNull();
              expect(data.status).toBeDefined();
              expect(data.result).toBeDefined();
              expect(typeof data.result === 'object').toBeTruthy();

              done();
            }
          );
        });
      });
    });
  });
});
