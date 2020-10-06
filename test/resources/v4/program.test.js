const sinon = require('sinon');
const RO = require('../../..');
const fixtures = require('../../fixtures/v4/program.fixtures');
const { mockConfig } = require('../../test-helpers/mock-config');

RO.config.init(
  mockConfig({
    apiVersion: 'v4',
    piiServerUrl: null,
    verbose: false,
  })
);

describe('v4 RO.program()', () => {
  /* jshint camelcase: false */

  beforeAll(() => {
    fixtures();
  });

  afterAll(() => {
    RO.config.reset();
  });

  it('should return an error when passed with a non-number', () => {
    const program1 = RO.program('1');
    const program2 = RO.program([]);

    expect(program1).toBeInstanceOf(Error);
    expect(program1.message).toEqual('Program ID must be a number');

    expect(program2).toBeInstanceOf(Error);
    expect(program2.message).toEqual('Program ID must be a number');
  });

  describe('id', () => {
    it('should be the number passed as an argument to ro.program()', () => {
      const id = Math.floor(Math.random() * (1000000 - 1)) + 1;
      const program = RO.program(id);

      expect(typeof program.id).toBe('number');
      expect(program.id).toEqual(id);
    });
  });

  describe('details()', () => {
    it('should be an alias for ro.programs.get(program.id)', () => {
      return new Promise(done => {
        // A random integer, per
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
        const id = Math.floor(Math.random() * (1000000 - 1)) + 1;
        const program = RO.program(id);

        sinon.spy(RO.programs, 'get').withArgs(id);

        program.details(() => {
          expect(RO.programs.get.calledWith(id)).toEqual(true);

          RO.programs.get.restore();

          done();
        });
      });
    });
  });
});
