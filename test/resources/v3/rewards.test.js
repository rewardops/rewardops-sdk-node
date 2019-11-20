const nock = require('nock');
const RO = require('../../..');
const fixtures = require('../../fixtures/v3/rewards.fixtures');

describe('v3 RO.program()', function() {
  beforeAll(function() {
    RO.config.set('apiVersion', 'v3');

    fixtures();
  });

  afterAll(function() {
    RO.config.reset();
  });

  describe('rewards', function() {
    const id = 33;
    const program = RO.program(id);

    beforeAll(function() {
      RO.config.set('clientId', 'rewardTest123');
      RO.config.set('clientSecret', 'itsATestGetUsedToIt');
    });

    afterAll(function() {
      RO.config.reset();
    });

    it('should have the correct program ID', function() {
      expect(program.rewards.programId).toEqual(id);
    });

    describe('getAll()', function() {
      it('should pass an array to the callback', function() {
        return new Promise(done => {
          nock(RO.urls.apiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234rewardTime',
            },
          })
            .get('/programs/33/rewards')
            .reply(200, {
              result: [],
            });

          program.rewards.getAll(function(error, data) {
            expect(Array.isArray(data)).toBe(true);

            done();
          });
        });
      });

      it('should make an HTTP get request to the correct URL', function() {
        return new Promise(done => {
          const apiCall = nock(RO.urls.apiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234rewardTime',
            },
          })
            .get('/programs/12/rewards')
            .reply(200, {
              result: [],
            });

          RO.program(12).rewards.getAll(function(error, rewardList) {
            expect(error).toEqual(null);

            expect(Array.isArray(rewardList)).toBe(true);
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
              Authorization: 'Bearer abcd1234rewardTime',
            },
          })
            .get('/programs/55/rewards')
            .query(params)
            .reply(200, {
              result: [],
            });

          RO.program(55).rewards.getAll(params, function(error, rewardsList) {
            expect(error).toEqual(null);

            expect(Array.isArray(rewardsList)).toBe(true);
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
              Authorization: 'Bearer abcd1234rewardTime',
            },
          })
            .get('/programs/33/rewards/555')
            .once()
            .reply(200, {
              result: {},
            });

          program.rewards.get(555, function(error, data) {
            expect(typeof data).toBe('object');

            done();
          });
        });
      });

      it('should make an HTTP get request to the correct URL', function() {
        return new Promise(done => {
          const apiCall = nock(RO.urls.apiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234rewardTime',
            },
          })
            .get('/programs/12/rewards/929')
            .once()
            .reply(200, {
              result: {},
            });

          RO.program(12).rewards.get(929, function(error, rewardList) {
            expect(error).toEqual(null);

            expect(typeof rewardList).toBe('object');
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
              Authorization: 'Bearer abcd1234rewardTime',
            },
          })
            .get('/programs/55/rewards/234')
            .query(params)
            .reply(200, {
              result: [],
            });

          RO.program(55).rewards.get(234, params, function(error, rewardsList) {
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
