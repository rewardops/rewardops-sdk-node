const nock = require('nock');
const RO = require('../../..');
const { mockConfig } = require('../../test-helpers/mock-config');
const { CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN } = require('../../fixtures/v5/credentials');

RO.config.init(
  mockConfig({
    apiVersion: 'v5',
    piiServerUrl: 'https://api-qa.ca.rewardops.io',
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    supportedLocales: ['en-CA'],
  })
);

describe('v5', () => {
  afterAll(() => {
    RO.config.reset();
  });

  describe('personalization', () => {
    const id = 384;
    const programCode = 'aeroplan_program';
    const program = RO.program(id, programCode);

    describe('registerMemberTags()', () => {
      it('should register member tags and return member UUID', () => {
        // https://api-qa.ca.rewardops.io/api/v5/auth/token

        nock('https://api-qa.ca.rewardops.io/')
          .post('/api/v5/auth/token')
          .reply(200, { token: ACCESS_TOKEN });

        const apiCall = nock('https://api-qa.ca.rewardops.io/', {
          reqHeaders: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        })
          .post(`/api/v5/programs/${programCode}/members`)
          .reply(200, {
            status: 'OK',
            result: {
              id: '123456',
              foreign_id: '114215767',
              segment: 'status',
              member_tags: 'stb,ubr',
            },
          });

        return new Promise(done => {
          program.personalization.registerMemberTags(
            {
              foreign_id: '114215767',
              segment: 'status',
              member_tags: 'stb,ubr',
              program_code: programCode,
            },
            (err, _, data) => {
              expect(err).toBe(undefined);
              expect(typeof data).toBe('object');
              expect(data.id).toBeDefined(); // id is memberUUID
              expect(data.foreign_id).toBeDefined();
              expect(data.member_tags).toBeDefined();
              expect(apiCall.isDone()).toEqual(true);

              done();
            }
          );
        });
      });
    });
  });
});
