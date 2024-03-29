const nock = require('nock');
const RO = require('../../..');
const fixtures = require('../../fixtures/v5/coupons.fixtures');
const { mockConfig } = require('../../test-helpers/mock-config');
const { CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN } = require('../../fixtures/v5/credentials');
const { getInputErrorMessage } = require('../../../lib/resources/coupons');

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
    const id = 33;
    const program = RO.program(id);

    describe('postValidate()', () => {
      it('should pass an object to the callback', () => {
        return new Promise(done => {
          const apiCall = nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          })
            .post('/coupon_preflight')
            .reply(200, {
              result: { status: 'OK', result: {} },
            });

          program.coupons.postValidate(
            {
              coupon_preflight: {
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
            },
            (error, data) => {
              expect(error).toBeNull();
              expect(typeof data).toBe('object');
              expect(data.status).toBeDefined();
              expect(data.result).toBeDefined();
              expect(typeof data.result).toBe('object');
              expect(apiCall.isDone()).toEqual(true);

              done();
            }
          );
        });
      });

      it('should return the api error (invalid coupon)', () => {
        return new Promise(done => {
          const errorObject = { error: 'invalidCoupon' };
          const apiCall = nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          })
            .post('/coupon_preflight')
            .reply(422, { error: errorObject });

          program.coupons.postValidate(
            {
              coupon_preflight: {
                owner_type: 'program',
                owner_code: 'am',
                coupon_code: 'INVALID-COUPON',
                external_member_id: '21dasd',
                items: [],
              },
            },
            error => {
              expect(error).not.toBeNull();
              expect(error.message).toMatchObject(errorObject);
              expect(apiCall.isDone()).toEqual(true);

              done();
            }
          );
        });
      });

      it('should return an error: missing coupon code', () => {
        return new Promise(done => {
          program.coupons.postValidate(
            {
              coupon_preflight: {
                owner_type: 'program',
                owner_code: 'am',
                external_member_id: '21dasd',
                items: [],
              },
            },
            error => {
              expect(error.message).toBe(getInputErrorMessage('coupon code', 'string'));
              expect(error).not.toBeNull();

              done();
            }
          );
        });
      });

      it('should return an error: missing external member id', () => {
        return new Promise(done => {
          program.coupons.postValidate(
            {
              coupon_preflight: {
                owner_type: 'program',
                owner_code: 'am',
                coupon_code: 'PRE-WGQY-7DSE',
                items: [],
              },
            },
            error => {
              expect(error.message).toBe(getInputErrorMessage('member id', 'string'));
              expect(error).not.toBeNull();

              done();
            }
          );
        });
      });

      it('should return an error: missing owner type', () => {
        return new Promise(done => {
          program.coupons.postValidate(
            {
              coupon_preflight: {
                owner_code: 'am',
                coupon_code: 'PRE-WGQY-7DSE',
                external_member_id: '21dasd',
                items: [],
              },
            },
            error => {
              expect(error.message).toBe(getInputErrorMessage('owner type', 'string'));
              expect(error).not.toBeNull();

              done();
            }
          );
        });
      });

      it('should return an error: missing owner code', () => {
        return new Promise(done => {
          program.coupons.postValidate(
            {
              coupon_preflight: {
                owner_type: 'program',
                coupon_code: 'PRE-WGQY-7DSE',
                external_member_id: '21dasd',
                items: [],
              },
            },
            error => {
              expect(error.message).toBe(getInputErrorMessage('owner code', 'string'));
              expect(error).not.toBeNull();

              done();
            }
          );
        });
      });

      it('should return an error: missing items', () => {
        return new Promise(done => {
          program.coupons.postValidate(
            {
              coupon_preflight: {
                owner_type: 'program',
                owner_code: 'am',
                coupon_code: 'PRE-WGQY-7DSE',
                external_member_id: '21dasd',
              },
            },
            error => {
              expect(error.message).toBe(getInputErrorMessage('items', 'array'));
              expect(error).not.toBeNull();

              done();
            }
          );
        });
      });
    });
  });
});
