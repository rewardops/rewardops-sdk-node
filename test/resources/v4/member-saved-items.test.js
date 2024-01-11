const nock = require('nock');
const RO = require('../../..');
const fixtures = require('../../fixtures/v4/items.fixtures');
const { mockConfig } = require('../../test-helpers/mock-config');

RO.config.init(
  mockConfig({
    apiVersion: 'v4',
    piiServerUrl: null,
    clientId: 'itemTest123',
    clientSecret: 'itsATestGetUsedToIt',
  })
);

describe('v4 RO.program()', () => {
  beforeAll(() => {
    fixtures();
  });

  describe('member-saved-items', () => {
    const id = 33;
    const program = RO.program(id);

    it('should have the correct program ID', () => {
      expect(program.memberSavedItems.programId).toEqual(id);
    });

    describe('getAll()', () => {
      it('should pass an array to the callback', () => {
        return new Promise(done => {
          nock(RO.urls.getApiBaseUrl(), {
            reqHeaders: {
              Authorization: 'Bearer abcd1234itemTime',
            },
          })
            .get('/programs/33/member_saved_items')
            .reply(200, {
              result: [],
            });

          program.memberSavedItems.getAll((error, data) => {
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
  });
});
