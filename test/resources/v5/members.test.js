const nock = require('nock');
const RO = require('../../..');
const { mockConfig } = require('../../test-helpers/mock-config');
const { generateBasicAuthToken } = require('../../../lib/utils/auth');
const { CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN } = require('../../fixtures/v5/credentials');

const mockCallBack = jest.fn();

RO.config.init(
  mockConfig({
    apiVersion: 'v5',
    piiServerUrl: null,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  })
);

describe('v5', () => {
  const memberUUID = 'a0bf0938-1a85-445d-a0bh-ebd23d35cb8s';

  afterAll(() => {
    RO.config.reset();
  });

  beforeAll(() => {
    nock(RO.auth.getBaseUrl(), {
      reqheaders: generateBasicAuthToken(CLIENT_ID, CLIENT_SECRET),
    })
      .post(RO.auth.getTokenPath(), {
        grant_type: 'client_credentials',
      })
      .times(6)
      .reply(200, {
        created_at: Math.round(+new Date() / 1000),
        expires_in: 7200,
        access_token: ACCESS_TOKEN,
      });
  });

  describe('members', () => {
    const id = 384;
    const programCode = 'aeroplan_program';
    const program = RO.program(id, programCode);

    describe('favourites', () => {
      describe('#addItem()', () => {
        const apiCall = nock(RO.urls.getApiBaseUrl(), {
          reqHeaders: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        })
          .post(`/programs/${programCode}/members/${memberUUID}/favourites`)
          .reply(200, {
            status: 'OK',
            result: [
              {
                siv_id: 1234,
                item_order_token: 'bwtb5ngbkz01nnkkxhnvzh7se3fgs108',
              },
            ],
          });

        describe('Mark a retailer as favourite successfully', () => {
          it('should add new favourite retailer', () => {
            return new Promise(done => {
              program.members(memberUUID).favourites.addItem(
                {
                  item_order_token: 'bwtb5ngbkz01nnkkxhnvzh7se3fgs108=',
                  member_tags: 'tag1,tag2',
                  segment: 'blue',
                },
                (error, data) => {
                  expect(error).toBeNull();
                  expect(typeof data).toBe('object');
                  expect(Array.isArray(data)).toBe(true);
                  expect(apiCall.isDone()).toEqual(true);

                  done();
                }
              );
            });
          });
        });

        describe('error handling', () => {
          it('responds with an error if the request params are empty', async () => {
            const requestBody = {};

            await program.members(memberUUID).favourites.addItem(requestBody, mockCallBack);

            expect(mockCallBack).toHaveBeenCalledWith(new Error('A params object is required'));
          });
        });
      });

      describe('#removeItem()', () => {
        const apiCall = nock(RO.urls.getApiBaseUrl(), {
          reqHeaders: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        })
          .delete(`/programs/${programCode}/members/${memberUUID}/favourites`)
          .reply(200, {
            status: 'OK',
            result: [
              {
                siv_id: 1234,
                item_order_token: 'bwtb5ngbkz01nnkkxhnvzh7se3fgs108',
              },
            ],
          });

        describe('Mark a retailer as unfavourite successfully', () => {
          it('should remove a retailer from the favourite list', () => {
            return new Promise(done => {
              program.members(memberUUID).favourites.removeItem(
                {
                  item_order_token: 'bwtb5ngbkz01nnkkxhnvzh7se3fgs108=',
                },
                (error, data) => {
                  expect(error).toBeNull();
                  expect(typeof data).toBe('object');
                  expect(Array.isArray(data)).toBe(true);
                  expect(apiCall.isDone()).toEqual(true);

                  done();
                }
              );
            });
          });
        });
      });
    });

    describe('wishlist', () => {
      describe('#addItem()', () => {
        describe('Mark an item as favourite successfully', () => {
          const apiCall = nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          })
            .post(`/programs/${programCode}/members/${memberUUID}/wishlist`)
            .reply(200, {
              status: 'OK',
              result: [
                {
                  siv_id: 1234,
                  item_order_token: 'bwtb5ngbkz01nnkkxhnvzh7se3fgs108',
                },
              ],
            });

          it('should create a new wishlist item', () => {
            return new Promise(done => {
              program.members(memberUUID).wishlist.addItem(
                {
                  item_order_token: 'bwtb5ngbkz01nnkkxhnvzh7se3fgs108=',
                },
                (error, data) => {
                  expect(error).toBeNull();
                  expect(typeof data).toBe('object');
                  expect(Array.isArray(data)).toBe(true);
                  expect(apiCall.isDone()).toEqual(true);

                  done();
                }
              );
            });
          });
        });

        describe('error handling', () => {
          it('responds with an error if the request params are empty', async () => {
            const requestBody = {};

            await program.members(memberUUID).wishlist.addItem(requestBody, mockCallBack);

            expect(mockCallBack).toHaveBeenCalledWith(new Error('A params object is required'));
          });
        });
      });

      describe('removeItem()', () => {
        it('should remove an item from wishlist', () => {
          const itemOrderToken = '0ca2cf32-59e8-473d-97ff-afc4e2670e37';

          const apiCall = nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          })
            .delete(`/programs/${programCode}/members/${memberUUID}/wishlist`)
            .reply(200, {
              status: 'OK',
              result: [
                {
                  siv_id: 1234,
                  item_order_token: 'bwtb5ngbkz01nnkkxhnvzh7se3fgs108',
                },
              ],
            });

          return new Promise(done => {
            program.members(memberUUID).wishlist.removeItem(itemOrderToken, (error, data) => {
              expect(error).toBeNull();
              expect(typeof data).toBe('object');
              expect(apiCall.isDone()).toEqual(true);

              done();
            });
          });
        });
      });
    });

    describe('cart', () => {
      describe('#getShoppingCartSummary()', () => {
        const params = {
          segment_code: 'status',
        };
        const apiCall = nock(RO.urls.getApiBaseUrl(), {
          reqHeaders: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        })
          .get(`/programs/${programCode}/members/${memberUUID}/cart/summary`)
          .query(params)
          .reply(200, {
            status: 'OK',
            result: {
              status: 'created',
              items: [
                {
                  siv_id: 272902,
                  iv_id: 204492,
                  quantity: 1,
                  custom_data: {},
                },
              ],
              available_unsaved_items: [
                {
                  siv_id: 272902,
                  iv_id: 204492,
                  quantity: 1,
                  custom_data: {},
                },
              ],
              unavailable_items: [],
              saved_items: [],
            },
          });

        it('should get the shopping cart successfully', () => {
          return new Promise(done => {
            program.members(memberUUID).cart.getSummary(params, (error, data) => {
              expect(error).toBeNull();
              expect(typeof data).toBe('object');
              expect(apiCall.isDone()).toEqual(true);

              done();
            });
          });
        });

        describe('error handling', () => {
          it('responds with an error if the request params are empty', async () => {
            const requestBody = {};

            await program.members(memberUUID).cart.getSummary(requestBody, mockCallBack);

            expect(mockCallBack).toHaveBeenCalledWith(new Error('A params object is required'));
          });

          it('responds with an error if the request param is not segment_code', async () => {
            const requestBody = { segment: 'status' };

            await program.members(memberUUID).cart.getSummary(requestBody, mockCallBack);

            expect(mockCallBack).toHaveBeenCalledWith(new Error('A segment_code param is required'));
          });
        });
      });

      describe('#updateShoppingCart()', () => {
        const apiCall = nock(RO.urls.getApiBaseUrl(), {
          reqHeaders: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        })
          .post(`/programs/${programCode}/members/${memberUUID}/cart/item`)
          .reply(200, {
            status: 'OK',
            result: {
              status: 'created',
              items: [
                {
                  siv_id: 272902,
                  iv_id: 204492,
                  quantity: 1,
                  custom_data: {},
                },
              ],
              available_unsaved_items: [
                {
                  siv_id: 272902,
                  iv_id: 204492,
                  quantity: 1,
                  custom_data: {},
                },
              ],
              unavailable_items: [],
              saved_items: [],
            },
          });

        it('should update a shopping cart successfully', () => {
          return new Promise(done => {
            program.members(memberUUID).cart.updateCart(
              {
                item_order_token: 'bwtb5ngbkz01nnkkxhnvzh7se3fgs108=',
                quantity: 1,
                is_saved_for_later: false,
                custom_data: {},
              },
              (error, data) => {
                expect(error).toBeNull();
                expect(typeof data).toBe('object');
                expect(apiCall.isDone()).toEqual(true);

                done();
              }
            );
          });
        });

        describe('error handling', () => {
          it('responds with an error if the request params are empty', async () => {
            const requestBody = {};

            await program.members(memberUUID).cart.updateCart(requestBody, mockCallBack);

            expect(mockCallBack).toHaveBeenCalledWith(new Error('A params object is required'));
          });
        });
      });
    });
  });
});
