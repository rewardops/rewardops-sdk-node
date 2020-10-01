const nock = require('nock');
const RO = require('../../..');
const fixtures = require('../../fixtures/v4/items.fixtures');

jest.mock('../../../lib/utils/logger', () => ({
  log: () => {},
  prettyPrint: () => {},
}));

describe('v4 RO.program()', () => {
  beforeAll(() => {
    RO.config.set('apiVersion', 'v4');
    RO.config.set('verbose', false);

    fixtures();
  });

  afterAll(() => {
    RO.config.reset();
  });

  describe('items', () => {
    const id = 33;
    const program = RO.program(id);

    beforeAll(() => {
      RO.config.set('clientId', 'itemTest123');
      RO.config.set('clientSecret', 'itsATestGetUsedToIt');
    });

    afterAll(() => {
      RO.config.reset();
    });

    it('should have the correct program ID', () => {
      expect(program.items.programId).toEqual(id);
    });

    describe('getAll()', () => {
      it('should pass an array to the callback', () => {
        return new Promise(done => {
          nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234itemTime',
            },
          })
            .get('/programs/33/items')
            .reply(200, {
              result: [],
            });

          program.items.getAll((error, data) => {
            expect(Array.isArray(data)).toBe(true);

            done();
          });
        });
      });

      it('should make an HTTP get request to the correct URL', () => {
        return new Promise(done => {
          const apiCall = nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234itemTime',
            },
          })
            .get('/programs/12/items')
            .reply(200, {
              result: [],
            });

          RO.program(12).items.getAll((error, itemList) => {
            expect(error).toEqual(null);

            expect(Array.isArray(itemList)).toBe(true);
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
              Authorization: 'Bearer abcd1234itemTime',
            },
          })
            .get('/programs/55/items')
            .query(params)
            .reply(200, {
              result: [],
            });

          RO.program(55).items.getAll(params, (error, itemsList) => {
            expect(error).toEqual(null);

            expect(Array.isArray(itemsList)).toBe(true);
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
              Authorization: 'Bearer abcd1234itemTime',
            },
          })
            .get('/programs/33/items/555')
            .once()
            .reply(200, {
              result: {},
            });

          program.items.get(555, (error, data) => {
            expect(typeof data).toBe('object');

            done();
          });
        });
      });

      it('should make an HTTP get request to the correct URL', () => {
        return new Promise(done => {
          const apiCall = nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234itemTime',
            },
          })
            .get('/programs/12/items/929')
            .once()
            .reply(200, {
              result: {},
            });

          RO.program(12).items.get(929, (error, itemList) => {
            expect(error).toEqual(null);

            expect(typeof itemList).toBe('object');
            expect(apiCall.isDone()).toEqual(true);

            done();
          });
        });
      });

      it('should accept an optional params object and pass it on to the RO.api.get() call as query params', () => {
        return new Promise(done => {
          const params = {
            member_id: '5432',
          };
          const scope = nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234itemTime',
            },
          })
            .get('/programs/55/items/234')
            .query(params)
            .reply(200, {
              result: [],
            });

          RO.program(55).items.get(234, params, (error, itemsList) => {
            expect(error).toEqual(null);

            expect(Array.isArray(itemsList)).toBe(true);
            expect(scope.isDone()).toEqual(true);

            done();
          });
        });
      });
    });

    describe('getParameter()', () => {
      it('should pass an object to the callback', () => {
        return new Promise(done => {
          nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234itemTime',
            },
          })
            .get('/programs/33/items/parameters')
            .once()
            .reply(200, {
              result: {},
            });

          program.items.getParameters((error, data) => {
            expect(typeof data).toBe('object');

            done();
          });
        });
      });

      it('should make an HTTP get request to the correct URL', () => {
        return new Promise(done => {
          const apiCall = nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234itemTime',
            },
          })
            .get('/programs/12/items/parameters')
            .once()
            .reply(200, {
              result: [],
            });

          RO.program(12).items.getParameters((error, data) => {
            expect(error).toEqual(null);

            expect(Array.isArray(data)).toBe(true);
            expect(apiCall.isDone()).toEqual(true);

            done();
          });
        });
      });

      it('should accept an optional params object and pass it on to the RO.api.get() call as query params', () => {
        return new Promise(done => {
          const params = {
            filter: 'CCATEGORY("CAT_TEST_001")',
          };
          const scope = nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234itemTime',
            },
          })
            .get('/programs/55/items/parameters')
            .query(params)
            .reply(200, {
              result: [],
            });

          RO.program(55).items.getParameters(params, (error, data) => {
            expect(error).toEqual(null);

            expect(Array.isArray(data)).toBe(true);
            expect(scope.isDone()).toEqual(true);

            done();
          });
        });
      });
    });
  });
});
