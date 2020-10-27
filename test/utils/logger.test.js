const mockDate = require('mockdate');
const faker = require('faker');
const _ = require('lodash');

const config = require('../../lib/config');
const { mockConfig } = require('../test-helpers/mock-config');

const {
  formatMessage,
  getLogLevel,
  log,
  prettyPrint,
  redactSecrets,
  LOG_PREFIX,
  REDACTED_MESSAGE,
} = jest.requireActual('../../lib/utils/logger');

// test setup
const timestamp = Date.now();

const originalConsole = console;
const mockConsole = { log: jest.fn(), warn: jest.fn() };
// freeze time
mockDate.set(timestamp);

describe('#prettyPrint', () => {
  it('should stringify an object', () => {
    const result = prettyPrint({
      name: 'AuthenticationError',
      message: 'Client authentication failed due to unknown client',
    });
    const expectedResult = `{
  "name": "AuthenticationError",
  "message": "Client authentication failed due to unknown client"
}`;

    expect(result).toEqual(expectedResult);
  });

  it('should stringify an array', () => {
    const result = prettyPrint(['Error 1', 'Error 2']);
    const expectedResult = `[
  "Error 1",
  "Error 2"
]`;

    expect(result).toEqual(expectedResult);
  });

  it('should handle an array of objects', () => {
    const result = prettyPrint([{ error: 'Something' }, { error: 'Went Wrong' }]);
    const expectedResult = `[
  {
    "error": "Something"
  },
  {
    "error": "Went Wrong"
  }
]`;

    expect(result).toEqual(expectedResult);
  });

  it.each`
    input        | expected
    ${100}       | ${'100'}
    ${'foobar'}  | ${'"foobar"'}
    ${null}      | ${'null'}
    ${NaN}       | ${'null'}
    ${Infinity}  | ${'null'}
    ${undefined} | ${undefined}
  `('should handle primitives ($input -> $expected)', ({ input, expected }) => {
    expect(prettyPrint(input)).toEqual(expected);
  });
});

describe('#redactSecrets', () => {
  it.each`
    input                                        | secretPropPath
    ${{ secret: 'sauce' }}                       | ${['secret']}
    ${{ clientSecret: faker.random.uuid() }}     | ${['clientSecret']}
    ${{ creditCard: '1234 1234 1234 1234' }}     | ${['creditCard']}
    ${[{ password: faker.random.words() }]}      | ${[0, 'password']}
    ${[{ api: { token: faker.random.uuid() } }]} | ${[0, 'api', 'token']}
  `('should redact secrets from JSON-stringifiable objects', ({ input, secretPropPath }) => {
    expect(_.get(redactSecrets(input), secretPropPath)).toEqual(REDACTED_MESSAGE);
  });
});

describe('#formatMessage', () => {
  it.each`
    input                         | expectedSubstring
    ${{}}                         | ${'{}'}
    ${[]}                         | ${'[]'}
    ${[{ bar: [{ baz: 'yo' }] }]} | ${'"baz": "yo"'}
    ${{ secret: 'message' }}      | ${`"secret": "${REDACTED_MESSAGE}"`}
  `('should pretty-print and redact secrets from JSON-stringifiable objects', ({ input, expectedSubstring }) => {
    const formattedMessage = formatMessage(input);

    expect(typeof formattedMessage).toEqual('string');
    expect(formattedMessage).toEqual(expect.stringContaining(expectedSubstring));
  });

  it.each([100, 'foobar', null, NaN, Infinity, undefined])('should passthrough primitives (%p)', input => {
    expect(formatMessage(input)).toBe(input);
  });
});

describe('#getLogLevel', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  describe('config settings', () => {
    test.each`
      verbose  | quiet    | expected
      ${false} | ${false} | ${'info'}
      ${true}  | ${false} | ${'verbose'}
      ${false} | ${true}  | ${'warn'}
      ${true}  | ${true}  | ${'verbose'}
    `(`returns '$expected' when 'verbose' is $verbose and 'quiet' is $quiet`, ({ verbose, quiet, expected }) => {
      config.set('verbose', verbose);
      config.set('quiet', quiet);

      expect(getLogLevel()).toEqual(expected);
    });
  });
});

describe('#log', () => {
  beforeEach(() => {
    // eslint-disable-next-line no-global-assign
    console = mockConsole;
  });
  afterAll(() => {
    // eslint-disable-next-line no-global-assign
    console = originalConsole;
    mockDate.reset();
  });

  const expectedDate = new Date(timestamp);

  test('logs are printed in the correct format', () => {
    log('testLog');

    const EXPECTED_SUBSTRINGS = [LOG_PREFIX, 'INFO', `[${expectedDate.toISOString()}]`, 'testLog'];
    EXPECTED_SUBSTRINGS.forEach(substring => {
      expect(mockConsole.log).toHaveBeenCalledWith(expect.stringContaining(substring));
    });
  });

  test('options.level is present in the log', () => {
    log('errorLog', { level: 'error' });

    const EXPECTED_SUBSTRINGS = [LOG_PREFIX, 'ERROR', `[${expectedDate.toISOString()}]`, 'errorLog'];
    EXPECTED_SUBSTRINGS.forEach(substring => {
      expect(mockConsole.log).toHaveBeenCalledWith(expect.stringContaining(substring));
    });
  });

  test('instances of Error are parsed into the log', () => {
    const error = new Error();
    error.message = 'errorMessage';
    error.stack = 'errorStack';

    log(error);

    const EXPECTED_SUBSTRINGS = [
      LOG_PREFIX,
      'ERROR',
      `[${expectedDate.toISOString()}]`,
      `${error.message}\n${error.stack}`,
    ];
    EXPECTED_SUBSTRINGS.forEach(substring => {
      expect(mockConsole.log).toHaveBeenCalledWith(expect.stringContaining(substring));
    });
  });

  describe('config settings', () => {
    test('options.meta is present in the log when `verbose` is true', () => {
      config.reset();
      config.init(mockConfig({ verbose: true }));

      log('testLog', { meta: { foo: 'bar' } });

      expect(mockConsole.log).toHaveBeenCalledWith(expect.stringContaining('"foo": "bar"'));
    });

    test('options.meta is not present in the log when `verbose` is `false`', () => {
      config.reset();
      config.init(mockConfig({ verbose: false }));

      log('testLog', { meta: { foo: 'bar' } });

      expect(mockConsole.log).toHaveBeenCalledWith(expect.not.stringContaining('"foo": "bar"'));
    });

    test('message is logged when `quiet` is true', () => {
      config.reset();
      config.init(mockConfig({ quiet: true }));

      log('testLog');

      expect(mockConsole.log).toHaveBeenCalledWith(expect.stringContaining('testLog'));
    });
  });
});
