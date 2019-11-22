const nock = require('nock');
const RO = require('../../..');
const fixtures = require('../../fixtures/v4/custom-categories.fixtures');

describe('v4 RO.program()', () => {
  beforeAll(() => {
    RO.config.set('apiVersion', 'v4');
    RO.config.set('verbose', false);

    fixtures();
  });

  afterAll(() => {
    RO.config.reset();
  });

  describe('customCategories', () => {
    const id = 33;
    const program = RO.program(id);

    beforeAll(() => {
      RO.config.set('clientId', 'customCategoryTest123');
      RO.config.set('clientSecret', 'itsATestGetUsedToIt');
    });

    afterAll(() => {
      RO.config.reset();
    });

    it('should have the correct program ID', () => {
      expect(program.customCategories.programId).toEqual(id);
    });

    describe('getAll()', () => {
      it('should pass an array to the callback', () => {
        return new Promise(done => {
          nock(RO.urls.apiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234customCategoryTime',
            },
          })
            .get('/programs/33/custom_categories')
            .reply(200, {
              result: [],
            });

          program.customCategories.getAll((error, data) => {
            expect(Array.isArray(data)).toBe(true);

            done();
          });
        });
      });

      it('should make an HTTP get request to the correct URL', () => {
        return new Promise(done => {
          const apiCall = nock(RO.urls.apiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234customCategoryTime',
            },
          })
            .get('/programs/12/custom_categories')
            .reply(200, {
              result: [],
            });

          RO.program(12).customCategories.getAll((error, customCategoryList) => {
            expect(error).toEqual(null);

            expect(Array.isArray(customCategoryList)).toBe(true);
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
          const scope = nock(RO.urls.apiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234customCategoryTime',
            },
          })
            .get('/programs/55/custom_categories')
            .query(params)
            .reply(200, {
              result: [],
            });

          RO.program(55).customCategories.getAll(params, (error, customCategoriesList) => {
            expect(error).toEqual(null);

            expect(Array.isArray(customCategoriesList)).toBe(true);
            expect(scope.isDone()).toEqual(true);

            done();
          });
        });
      });
    });

    describe('get()', () => {
      it('should return an error if the category code is not a string', () => {
        return new Promise(done => {
          program.customCategories.get(1406, (error, data) => {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toEqual('must pass a string as the category code');
            expect(data).toEqual(undefined);

            done();
          });
        });
      });

      it('should pass an object to the callback', () => {
        return new Promise(done => {
          nock(RO.urls.apiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234customCategoryTime',
            },
          })
            .get('/programs/33/custom_categories/DOG_000007')
            .once()
            .reply(200, {
              result: {},
            });

          program.customCategories.get('DOG_000007', (error, data) => {
            expect(typeof data).toBe('object');

            done();
          });
        });
      });

      it('should make an HTTP get request to the correct URL', () => {
        return new Promise(done => {
          const apiCall = nock(RO.urls.apiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234customCategoryTime',
            },
          })
            .get('/programs/12/custom_categories/CAT_000002')
            .once()
            .reply(200, {
              result: {},
            });

          RO.program(12).customCategories.get('CAT_000002', (error, customCategoryList) => {
            expect(error).toEqual(null);

            expect(typeof customCategoryList).toBe('object');
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
          const scope = nock(RO.urls.apiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234customCategoryTime',
            },
          })
            .get('/programs/55/custom_categories/RAT_000002')
            .query(params)
            .reply(200, {
              result: [],
            });

          RO.program(55).customCategories.get('RAT_000002', params, function(error, customCategoriesList) {
            expect(error).toEqual(null);

            expect(Array.isArray(customCategoriesList)).toBe(true);
            expect(scope.isDone()).toEqual(true);

            done();
          });
        });
      });
    });
  });
});
