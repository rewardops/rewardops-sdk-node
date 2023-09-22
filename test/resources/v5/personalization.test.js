const RO = require('../../..');
const { mockConfig } = require('../../test-helpers/mock-config');
const { CLIENT_ID, CLIENT_SECRET } = require('../../fixtures/v5/credentials');

// NOTE: for this test to work we have to use real CLIENT_ID and CLIENT_SECRET values instead of mock ones
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
        return new Promise(done => {
          program.personalization
            .registerMemberTags({
              foreign_id: '114215767',
              segment: 'status',
              member_tags: 'stb,ubr',
              program_code: programCode,
            })
            .then(data => {
              expect(typeof data).toBe('object');
              expect(data.id).toBeDefined(); // id is memberUUID
              expect(data.foreign_id).toBeDefined();
              expect(data.member_tags).toBeDefined();

              done();
            });
        });
      }, 20000); // sometimes the pii server takes time to respond
    });
  });
});
