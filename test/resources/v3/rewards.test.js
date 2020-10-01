const nock = require('nock');
const RO = require('../../..');
const fixtures = require('../../fixtures/v3/rewards.fixtures');

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

  describe('rewards', () => {
    const id = 33;
    const program = RO.program(id);

    beforeAll(() => {
      RO.config.set('clientId', 'rewardTest123');
      RO.config.set('clientSecret', 'itsATestGetUsedToIt');
    });

    afterAll(() => {
      RO.config.reset();
    });

    it('should have the correct program ID', () => {
      expect(program.rewards.programId).toEqual(id);
    });

    describe('getAll()', () => {
      it('should pass an array to the callback', () => {
        return new Promise(done => {
          nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234rewardTime',
            },
          })
            .get('/programs/33/rewards')
            .reply(200, {
              result: [],
            });

          program.rewards.getAll((error, data) => {
            expect(Array.isArray(data)).toBe(true);

            done();
          });
        });
      });

      it('should make an HTTP get request to the correct URL', () => {
        return new Promise(done => {
          const apiCall = nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234rewardTime',
            },
          })
            .get('/programs/12/rewards')
            .reply(200, {
              result: [],
            });

          RO.program(12).rewards.getAll((error, rewardList) => {
            expect(error).toEqual(null);

            expect(Array.isArray(rewardList)).toBe(true);
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
              Authorization: 'Bearer abcd1234rewardTime',
            },
          })
            .get('/programs/55/rewards')
            .query(params)
            .reply(200, {
              result: [],
            });

          RO.program(55).rewards.getAll(params, (error, rewardsList) => {
            expect(error).toEqual(null);

            expect(Array.isArray(rewardsList)).toBe(true);
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
              Authorization: 'Bearer abcd1234rewardTime',
            },
          })
            .get('/programs/33/rewards/555')
            .once()
            .reply(200, {
              result: {},
            });

          program.rewards.get(555, (error, data) => {
            expect(typeof data).toBe('object');

            done();
          });
        });
      });

      it('should make an HTTP get request to the correct URL', () => {
        return new Promise(done => {
          const apiCall = nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234rewardTime',
            },
          })
            .get('/programs/12/rewards/929')
            .once()
            .reply(200, {
              result: {},
            });

          RO.program(12).rewards.get(929, (error, rewardList) => {
            expect(error).toEqual(null);

            expect(typeof rewardList).toBe('object');
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
              Authorization: 'Bearer abcd1234rewardTime',
            },
          })
            .get('/programs/55/rewards/234')
            .query(params)
            .reply(200, {
              result: [],
            });

          RO.program(55).rewards.get(234, params, (error, rewardsList) => {
            expect(error).toEqual(null);

            expect(Array.isArray(rewardsList)).toBe(true);
            expect(scope.isDone()).toEqual(true);

            done();
          });
        });
      });
    });
  });
});
