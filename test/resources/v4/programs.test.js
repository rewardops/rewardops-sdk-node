const nock = require('nock');
const fixtures = require('../../fixtures/v3/programs.fixtures');
const RO = require('../../..');

describe('v4 RO.programs', () => {
  beforeAll(() => {
    RO.config.set('apiVersion', 'v3');
    RO.config.set('quiet', true);

    fixtures();
  });

  afterAll(() => {
    RO.config.reset();
  });

  describe('getAll()', () => {
    beforeAll(() => {
      RO.config.set('clientId', 'mockedclientidforprogramstests');
      RO.config.set('clientSecret', 'mockedclientsecretforprogramstests');
    });

    afterAll(() => {
      RO.config.set('clientId', undefined);
      RO.config.set('clientSecret', undefined);
    });

    it('should pass an array to the callback', () => {
      return new Promise(done => {
        RO.programs.getAll((error, programList) => {
          expect(error).toEqual(null);

          expect(Array.isArray(programList)).toBe(true);

          done();
        });
      });
    });

    it('should make an HTTP get request to the correct URL', () => {
      return new Promise(done => {
        const apiCall = nock(`${RO.urls.getApiServerUrl()}/api/v3`)
          .get('/programs')
          .reply(200, {
            result: [],
          });

        RO.programs.getAll((error, programList) => {
          expect(error).toEqual(null);

          expect(Array.isArray(programList)).toBe(true);
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
        const scope = nock(`${RO.urls.getApiServerUrl()}/api/v3`, {
          reqHeaders: {
            Authorization: 'Bearer abcd1234programs',
          },
        })
          .get('/programs')
          .query(params)
          .reply(200, {
            result: [],
          });

        RO.programs.getAll(params, (error, programsList) => {
          expect(error).toEqual(null);

          expect(Array.isArray(programsList)).toBe(true);
          expect(scope.isDone()).toEqual(true);

          done();
        });
      });
    });
  });

  describe('get()', () => {
    beforeAll(() => {
      RO.config.set('clientId', 'mockedclientidforprogramstests');
      RO.config.set('clientSecret', 'mockedclientsecretforprogramstests');
    });

    afterAll(() => {
      RO.config.set('clientId', undefined);
      RO.config.set('clientSecret', undefined);
    });

    it('should pass an object to the callback', () => {
      return new Promise(done => {
        const id = 555;

        RO.programs.get(id, (error, data) => {
          expect(error).toEqual(null);

          expect(typeof data).toBe('object');

          done();
        });
      });
    });

    it('should make an HTTP get request to the correct URL', () => {
      return new Promise(done => {
        const scope = nock(`${RO.urls.getApiServerUrl()}/api/v3`, {
          reqHeaders: {
            Authorization: 'Bearer abcd1234programs',
          },
        })
          .get('/programs/567')
          .reply(200, {
            result: {},
          });

        RO.programs.get('567', (error, program) => {
          expect(error).toEqual(null);

          expect(typeof program).toBe('object');
          expect(scope.isDone()).toEqual(true);

          done();
        });
      });
    });
  });
});
