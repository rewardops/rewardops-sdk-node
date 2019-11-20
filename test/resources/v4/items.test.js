const nock = require('nock');
const RO = require('../../..');
const fixtures = require('../../fixtures/v4/items.fixtures');

describe('v4 RO.program()', function() {
  beforeAll(function() {
    RO.config.set('apiVersion', 'v4');

    fixtures();
  });

  afterAll(function() {
    RO.config.reset();
  });

  describe('items', function() {
    const id = 33;
    const program = RO.program(id);

    beforeAll(function() {
      RO.config.set('clientId', 'itemTest123');
      RO.config.set('clientSecret', 'itsATestGetUsedToIt');
    });

    afterAll(function() {
      RO.config.reset();
    });

    it('should have the correct program ID', function() {
      expect(program.items.programId).toEqual(id);
    });

    describe('getAll()', function() {
      it('should pass an array to the callback', function() {
        return new Promise(done => {
          nock(RO.urls.apiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234itemTime',
            },
          })
            .get('/programs/33/items')
            .reply(200, {
              result: [],
            });

          program.items.getAll(function(error, data) {
            expect(Array.isArray(data)).toBe(true);

            done();
          });
        });
      });

      it('should make an HTTP get request to the correct URL', function() {
        return new Promise(done => {
          const apiCall = nock(RO.urls.apiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234itemTime',
            },
          })
            .get('/programs/12/items')
            .reply(200, {
              result: [],
            });

          RO.program(12).items.getAll(function(error, itemList) {
            expect(error).toEqual(null);

            expect(Array.isArray(itemList)).toBe(true);
            expect(apiCall.isDone()).toEqual(true);

            done();
          });
        });
      });

      it('should accept an optional params object and pass it on to the RO.api.get() call as query params', function() {
        return new Promise(done => {
          const params = {
            page: 7,
            per_page_count: 50,
          };
          const scope = nock(RO.urls.apiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234itemTime',
            },
          })
            .get('/programs/55/items')
            .query(params)
            .reply(200, {
              result: [],
            });

          RO.program(55).items.getAll(params, function(error, itemsList) {
            expect(error).toEqual(null);

            expect(Array.isArray(itemsList)).toBe(true);
            expect(scope.isDone()).toEqual(true);

            done();
          });
        });
      });
    });

    describe('get()', function() {
      it('should pass an object to the callback', function() {
        return new Promise(done => {
          nock(RO.urls.apiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234itemTime',
            },
          })
            .get('/programs/33/items/555')
            .once()
            .reply(200, {
              result: {},
            });

          program.items.get(555, function(error, data) {
            expect(typeof data).toBe('object');

            done();
          });
        });
      });

      it('should make an HTTP get request to the correct URL', function() {
        return new Promise(done => {
          const apiCall = nock(RO.urls.apiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234itemTime',
            },
          })
            .get('/programs/12/items/929')
            .once()
            .reply(200, {
              result: {},
            });

          RO.program(12).items.get(929, function(error, itemList) {
            expect(error).toEqual(null);

            expect(typeof itemList).toBe('object');
            expect(apiCall.isDone()).toEqual(true);

            done();
          });
        });
      });

      it('should accept an optional params object and pass it on to the RO.api.get() call as query params', function() {
        return new Promise(done => {
          const params = {
            member_id: '5432',
          };
          const scope = nock(RO.urls.apiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234itemTime',
            },
          })
            .get('/programs/55/items/234')
            .query(params)
            .reply(200, {
              result: [],
            });

          RO.program(55).items.get(234, params, function(error, itemsList) {
            expect(error).toEqual(null);

            expect(Array.isArray(itemsList)).toBe(true);
            expect(scope.isDone()).toEqual(true);

            done();
          });
        });
      });
    });

    describe('getParameter()', function() {
      it('should pass an object to the callback', function() {
        return new Promise(done => {
          nock(RO.urls.apiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234itemTime',
            },
          })
            .get('/programs/33/items/parameters')
            .once()
            .reply(200, {
              result: {},
            });

          program.items.getParameters(function(error, data) {
            expect(typeof data).toBe('object');

            done();
          });
        });
      });

      it('should make an HTTP get request to the correct URL', function() {
        return new Promise(done => {
          const apiCall = nock(RO.urls.apiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234itemTime',
            },
          })
            .get('/programs/12/items/parameters')
            .once()
            .reply(200, {
              result: [],
            });

          RO.program(12).items.getParameters(function(error, data) {
            expect(error).toEqual(null);

            expect(Array.isArray(data)).toBe(true);
            expect(apiCall.isDone()).toEqual(true);

            done();
          });
        });
      });

      it('should accept an optional params object and pass it on to the RO.api.get() call as query params', function() {
        return new Promise(done => {
          const params = {
            filter: 'CCATEGORY("CAT_TEST_001")',
          };
          const scope = nock(RO.urls.apiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234itemTime',
            },
          })
            .get('/programs/55/items/parameters')
            .query(params)
            .reply(200, {
              result: [],
            });

          RO.program(55).items.getParameters(params, function(error, data) {
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
