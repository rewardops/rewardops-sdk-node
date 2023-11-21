const nock = require('nock');
const RO = require('../../..');
const { mockConfig } = require('../../test-helpers/mock-config');
const { generateBasicAuthToken } = require('../../../lib/utils/auth');
const { CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN } = require('../../fixtures/v5/credentials');

RO.config.init(
  mockConfig({
    apiVersion: 'v5',
    piiServerUrl: null,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  })
);

describe('v5', () => {
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

  describe('subsegments', () => {
    const programId = 384;
    const programCode = 'aeroplan_program';
    const program = RO.program(programId, programCode);

    describe('#getAllSubsegments()', () => {
      const apiCall = nock(RO.urls.getApiBaseUrl(), {
        reqHeaders: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      })
        .get(`/programs/${programCode}/subsegments`)
        .reply(200, {
          status: 'OK',
          result: [
            {
              name: 'TEST Visa Card',
              code: 'test_vpr',
              description: 'TEST Aeroplan Visa Card',
              member_tag: 'TVC',
              created_at: '2023-08-30T17:34:23.731Z',
              updated_at: '2023-10-30T21:15:34.252Z',
              images: {
                'fr-CA': [],
              },
            },
          ],
        });

      it('should responds subsegments data', () => {
        return new Promise(done => {
          program.subsegments.getAll((error, data) => {
            expect(error).toBeNull();
            expect(typeof data).toBe('object');
            expect(Array.isArray(data)).toBe(true);
            expect(apiCall.isDone()).toEqual(true);

            done();
          });
        });
      });
    });
  });
});
