const nock = require('nock');
const RO = require('../../..');
const fixtures = require('../../fixtures/v3/program-orders.fixtures');

jest.mock('../../../lib/utils/logger', () => ({
  log: () => {},
  prettyPrint: () => {},
}));

describe('v3 RO.program()', () => {
  beforeAll(() => {
    RO.config.set('apiVersion', 'v3');
    RO.config.set('verbose', false);

    fixtures();
  });

  afterAll(() => {
    RO.config.reset();
  });

  describe('orders', () => {
    const id = 33;
    const program = RO.program(id);

    beforeAll(() => {
      RO.config.set('clientId', 'programTest123');
      RO.config.set('clientSecret', 'itsATestGetUsedToIt');
    });

    afterAll(() => {
      RO.config.reset();
    });

    it('should have the correct context ID', () => {
      expect(program.orders.contextId).toEqual(id);
    });

    it('should have the correct context', () => {
      expect(program.orders.contextTypeName).toEqual('programs');
    });

    describe('getAll()', () => {
      it('should pass an array to the callback', () => {
        return new Promise(done => {
          nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234programTime',
            },
          })
            .get('/programs/33/orders')
            .query({
              member_id: 38,
            })
            .reply(200, {
              result: [],
            });

          program.orders.getAll(38, (error, data) => {
            expect(Array.isArray(data)).toBe(true);

            done();
          });
        });
      });

      it('should make an HTTP get request to the correct URL', () => {
        return new Promise(done => {
          const apiCall = nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234programTime',
            },
          })
            .get('/programs/12/orders')
            .query({
              member_id: 3,
            })
            .reply(200, {
              result: [],
            });

          RO.program(12).orders.getAll(3, (error, orderList) => {
            expect(error).toEqual(null);

            expect(Array.isArray(orderList)).toBe(true);
            expect(apiCall.isDone()).toEqual(true);

            done();
          });
        });
      });

      it('should accept an optional params object and pass it on to the RO.api.get() call as query params', () => {
        return new Promise(done => {
          const params = {
            page: 7,
            per_page_count: 50,
          };
          const scope = nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234programTime',
            },
          })
            .get('/programs/55/orders')
            .query({ ...params, member_id: 777 })
            .reply(200, {
              result: [],
            });

          RO.program(55).orders.getAll(777, params, (error, programsList) => {
            expect(error).toEqual(null);

            expect(Array.isArray(programsList)).toBe(true);
            expect(scope.isDone()).toEqual(true);

            done();
          });
        });
      });
    });

    describe('get()', () => {
      it('should pass an object to the callback', () => {
        return new Promise(done => {
          nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234programTime',
            },
          })
            .get('/programs/33/orders/555')
            .once()
            .reply(200, {
              result: {},
            });

          program.orders.get(555, (error, data) => {
            expect(typeof data).toBe('object');

            done();
          });
        });
      });

      it('should make an HTTP get request to the correct URL', () => {
        return new Promise(done => {
          const apiCall = nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234programTime',
            },
          })
            .get('/programs/12/orders/929')
            .once()
            .reply(200, {
              result: {},
            });

          RO.program(12).orders.get(929, (error, orderList) => {
            expect(error).toEqual(null);

            expect(typeof orderList).toBe('object');
            expect(apiCall.isDone()).toEqual(true);

            done();
          });
        });
      });
    });

    describe('create()', () => {
      it('should fire the callback with an error when a non-number is passed as the reward ID', () => {
        return new Promise(done => {
          const options = {
            reward_id: '131313', // A string, not a number
            member: { id: 'anything' },
          };
          const scope = nock(RO.urls.getApiBaseUrl())
            .post('/programs/33/orders', options)
            .reply(200);

          program.orders.create(options, (error, data) => {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toEqual('reward_id must be a number');

            expect(data).toEqual(undefined);

            expect(scope.isDone()).toEqual(false);

            done();
          });
        });
      });

      it('should pass an object to the callback', () => {
        return new Promise(done => {
          const newOrder = {
            reward_id: 1234,
            member: {
              id: 'abc123ppp',
            },
          };

          nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234programTime',
            },
          })
            .post('/programs/33/orders', newOrder)
            .reply(200, {
              result: {},
            });

          program.orders.create(newOrder, (error, result) => {
            expect(typeof result).toBe('object');

            done();
          });
        });
      });

      it('should make an HTTP get request to the correct URL', () => {
        return new Promise(done => {
          const newOrder = {
            reward_id: 1234,
            retail_value: 4,
            member: {
              id: 'ab098765',
              full_name: 'Prit Kaur',
              email: 'prit@hotmail.co.uk',
              phone: '123-456-7890',
              address: {
                address: '123 Some Town',
                city: 'Sheffield',
                country_code: 'UK',
                postal_code: 'S32 5N9',
              },
            },
          };
          const apiCall = nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234programTime',
            },
          })
            .post('/programs/33/orders', newOrder)
            .reply(200, {
              result: { status: 'OK' },
            });

          RO.program(33).orders.create(newOrder, (error, result) => {
            expect(error).toEqual(null);

            expect(result).toEqual({ status: 'OK' });
            expect(apiCall.isDone()).toEqual(true);

            done();
          });
        });
      });

      it("should pass an error to the callback when a params object isn't passed", () => {
        return new Promise(done => {
          const scope = nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234programTime',
            },
          })
            .post('/programs/133000/orders')
            .reply(200, {
              result: {},
            });

          RO.program(133000).orders.create((error, result) => {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toEqual('A params object is required');

            expect(result).toEqual(undefined);

            expect(scope.isDone()).toEqual(false);

            done();
          });
        });
      });
    });
  });
});
