// NOTE: Logger exports are imported using `jest.requireActual` as they are globally mocked
const mockDate = require('mockdate');
const { faker } = require('@faker-js/faker');
const _ = require('lodash');

const config = require('../../lib/config');
const { LOG_PREFIX } = require('../../lib/constants');
const { mockConfig } = require('../test-helpers/mock-config');

const { prettyPrint, REDACTED_MESSAGE, cleanMessage } = jest.requireActual('../../lib/utils/logger');

// fixtures
const id = faker.datatype.uuid();

const PIIData = {
  id,
  full_name: faker.name.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  accept_language: 'en-CA',
  address: {
    address: faker.address.streetAddress(),
    address_2: faker.address.streetAddress(),
    city: faker.address.city(),
    country_code: 'CA',
    country_subregion_code: 'AB',
    postal_code: 'S0S 6V0',
  },
  gift: false,
  ip_address: '::ffff:127.0.0.1',
};

const filteredPIIData = {
  id,
  full_name: '[REDACTED]',
  email: '[REDACTED]',
  phone: '[REDACTED]',
  accept_language: 'en-CA',
  address: '[REDACTED]',
  gift: false,
  ip_address: '[REDACTED]',
};

const secrets = { username: 'Nick', password: 'Jonas' };
const redactedSecrets = { username: 'Nick', password: REDACTED_MESSAGE };

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
  const { redactSecrets } = jest.requireActual('../../lib/utils/logger');

  it.each`
    input                                          | secretPropPath
    ${{ secret: 'sauce' }}                         | ${['secret']}
    ${{ clientSecret: faker.datatype.uuid() }}     | ${['clientSecret']}
    ${{ creditCard: '1234 1234 1234 1234' }}       | ${['creditCard']}
    ${[{ password: faker.random.words() }]}        | ${[0, 'password']}
    ${[{ api: { token: faker.datatype.uuid() } }]} | ${[0, 'api', 'token']}
  `('should redact secrets from JSON-stringifiable objects', ({ input, secretPropPath }) => {
    expect(_.get(redactSecrets(input), secretPropPath)).toEqual(REDACTED_MESSAGE);
  });
});

describe('#formatMessage', () => {
  const { formatMessage } = jest.requireActual('../../lib/utils/logger');

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
  const { getLogLevel } = jest.requireActual('../../lib/utils/logger');

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  describe('config settings', () => {
    test.each`
      silent   | verbose  | quiet    | expected
      ${false} | ${false} | ${false} | ${'info'}
      ${false} | ${true}  | ${false} | ${'verbose'}
      ${false} | ${false} | ${true}  | ${'warn'}
      ${false} | ${true}  | ${true}  | ${'verbose'}
      ${true}  | ${true}  | ${true}  | ${'verbose'}
      ${true}  | ${false} | ${true}  | ${'warn'}
    `(
      `returns '$expected' when 'silent' is $silent, 'verbose' is $verbose, and 'quiet' is $quiet`,
      ({ silent, verbose, quiet, expected }) => {
        config.set('silent', silent);
        config.set('verbose', verbose);
        config.set('quiet', quiet);

        expect(getLogLevel()).toEqual(expected);
      }
    );
  });
});

describe('#filterLogData', () => {
  const { filterLogData } = jest.requireActual('../../lib/utils/logger');

  it.each([[], null, undefined, 1, 'foo'])('returns %p since it is not an object', input => {
    expect(filterLogData(input)).toBe(input);
  });

  it('should convert an Error object to a plain object', () => {
    const error = new Error('test error');

    const output = filterLogData(error);

    expect(output instanceof Error).toBe(false);
    expect(output).toEqual({ message: 'test error', name: 'Error', stack: expect.any(String) });
  });

  it('should filter out PII data from an Error object', () => {
    const error = new Error();
    error.metaData = PIIData;

    const output = filterLogData(error);

    expect(output.metaData).toEqual(filteredPIIData);
  });

  it('should redact secrets from an Error object', () => {
    const error = new Error();
    error.metaData = secrets;

    const output = filterLogData(error);

    expect(output.metaData).toEqual(redactedSecrets);
  });

  it('should filter out nested data', () => {
    const input = {
      endpoint: 'https://authEndpoint/token',
      queryParams: 'grant_type=refresh_token&refresh_token=refreshToken',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // this is the target to filter
        Authorization: `Basic ${faker.random.alphaNumeric()}`,
      },
    };

    const output = filterLogData(input);

    expect(output.headers).toEqual(expect.objectContaining({ Authorization: REDACTED_MESSAGE }));
  });

  it('should filter out PII', () => {
    const output = filterLogData(PIIData);

    expect(output).toEqual(filteredPIIData);
  });
});

describe('#processLogData', () => {
  const { processLogData } = jest.requireActual('../../lib/utils/logger');

  it('should filter then pretty print the log data', () => {
    const output = processLogData(PIIData);

    expect(output).toEqual(prettyPrint(filteredPIIData));
  });
});

describe('#logFormat', () => {
  const { logFormat } = jest.requireActual('../../lib/utils/logger');

  const mockTimestamp = new Date().toISOString();
  const mockLogLevel = faker.helpers.arrayElement(['error', 'warn', 'info', 'debug', 'verbose']);
  const mockMessage = faker.lorem.sentence();

  it('logs SDK prefix, timestamp, and log level', () => {
    expect.assertions(4);

    const formattedLog = logFormat({ level: mockLogLevel, message: mockMessage, timestamp: mockTimestamp });

    const EXPECTED_SUBSTRINGS = [LOG_PREFIX, mockTimestamp, mockLogLevel.toUpperCase(), mockMessage];
    EXPECTED_SUBSTRINGS.forEach(substring => {
      expect(formattedLog).toEqual(expect.stringContaining(substring));
    });
  });

  it('logs pretty-printed message, without unprovided metadata', () => {
    const formattedLog = logFormat({ level: mockLogLevel, message: { foo: 'bar' }, timestamp: mockTimestamp });

    expect(formattedLog).toEqual(
      expect.stringContaining(`{
  "foo": "bar"
}`)
    );
    expect(formattedLog).not.toEqual(expect.stringContaining('Metadata'));
  });

  it('logs pretty-printed metadata, if provided', () => {
    const formattedLog = logFormat({
      level: mockLogLevel,
      message: 'foobar',
      timestamp: mockTimestamp,
      meta: { baz: 'yo' },
    });

    expect(formattedLog).toEqual(
      expect.stringContaining(`\nMetadata:\t{
  "baz": "yo"
}`)
    );
  });

  it('filters PII from log messages', () => {
    expect.assertions(5);

    const mockClientId = faker.datatype.uuid();
    const messageWithPii = {
      clientId: mockClientId,
      clientSecret: faker.datatype.uuid(),
      foo: 'bar',
      apiToken: faker.datatype.uuid(),
      access_token: faker.datatype.uuid(),
    };
    const formattedLog = logFormat({ level: mockLogLevel, message: messageWithPii, timestamp: mockTimestamp });

    const EXPECTED_SUBSTRINGS = [
      `"clientId": "${mockClientId}"`,
      `"clientSecret": "${REDACTED_MESSAGE}"`,
      `"foo": "bar"`,
      `"apiToken": "${REDACTED_MESSAGE}"`,
      `"access_token": "${REDACTED_MESSAGE}"`,
    ];
    EXPECTED_SUBSTRINGS.forEach(substring => {
      expect(formattedLog).toEqual(expect.stringContaining(substring));
    });
  });

  it('logs inputs with correct format', () => {
    const formattedLog = logFormat({ level: mockLogLevel, message: mockMessage, timestamp: mockTimestamp });

    const expectedLog = `[${mockTimestamp}] [${LOG_PREFIX} ${mockLogLevel.toUpperCase()}] [${mockMessage}]`;

    expect(formattedLog).toEqual(expectedLog);
  });
});

describe('#log', () => {
  const { log } = jest.requireActual('../../lib/utils/logger');

  const timestamp = Date.now();

  const originalConsole = console;
  let mockConsole;
  beforeEach(() => {
    mockConsole = { log: jest.fn(), warn: jest.fn(), error: jest.fn() };
    // eslint-disable-next-line no-global-assign
    console = mockConsole;

    mockDate.set(timestamp);
  });
  afterEach(() => {
    // eslint-disable-next-line no-global-assign
    console = originalConsole;

    mockDate.reset();
  });

  test('logs replace placeholders with the passed in data', () => {
    log('here is my {message}', { data: { message: 'foobar' } });

    expect(mockConsole.log).toHaveBeenCalledWith(expect.stringContaining('foobar'));
  });

  test('logs replace multiple placeholders with the passed in data', () => {
    const shoes = { brand: 'Nike', size: 12 };

    log('here is my {firstMessage}, and {shoes}', {
      data: { firstMessage: 'foobar', shoes },
    });

    expect(mockConsole.log).toHaveBeenCalledWith(expect.stringContaining('foobar'));
    expect(mockConsole.log).toHaveBeenCalledWith(expect.stringContaining(prettyPrint(shoes)));
  });

  test('logs filter PII and secrets when passed as data', () => {
    log('here are my {secrets}, and {PIIData}', {
      data: { secrets, PIIData },
    });

    expect(mockConsole.log).toHaveBeenCalledWith(expect.stringContaining(prettyPrint(filteredPIIData)));
    expect(mockConsole.log).toHaveBeenCalledWith(expect.stringContaining(prettyPrint(redactedSecrets)));
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
    expect.assertions(4);

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
    const { resetLoggerSetup } = jest.requireActual('../../lib/utils/logger');

    afterEach(() => {
      config.reset();
      resetLoggerSetup();
    });

    test('options.meta is present in the log when `verbose` is true', () => {
      config.init(mockConfig({ verbose: true }));

      log('options.meta testLog', { meta: { foo: 'bar' } });

      expect(mockConsole.log).toHaveBeenCalledWith(expect.stringContaining('"foo": "bar"'));
    });

    test('options.meta is not present in the log when `verbose` is `false`', () => {
      config.init(mockConfig({ verbose: false }));

      log('options.meta testLog', { meta: { foo: 'bar' } });

      expect(mockConsole.log).toHaveBeenCalledWith(expect.not.stringContaining('"foo": "bar"'));
    });

    test.each(['error', 'warn'])('%s message is logged when `quiet` is `true` and `verbose` is `false`', level => {
      config.init(mockConfig({ verbose: false, quiet: true }));

      log('quiet testLog', { level });

      expect(mockConsole.log).toHaveBeenCalledWith(expect.stringContaining('testLog'));
    });

    test.each(['info', 'debug'])('%s message is NOT logged when `quiet` is `true` and `verbose` is `false`', level => {
      config.init(mockConfig({ verbose: false, quiet: true }));

      log('quiet testLog', { level });

      expect(mockConsole.log).not.toHaveBeenCalledWith(expect.stringContaining('testLog'));
    });

    test.each(['error', 'warn', 'info', 'debug'])('%s message is NOT logged when `silent` is `true`', level => {
      config.init(mockConfig({ silent: true }));

      log('silent testLog', { level });

      const consoleFn = level === 'error' || level === 'warn' ? mockConsole[level] : mockConsole.log;
      expect(consoleFn).not.toHaveBeenCalledWith(expect.stringContaining('testLog'));
    });
  });

  describe('clean message logger', () => {
    test.each([
      {
        data: {
          coupon_code: ['coupon code not found'],
        },
        expected: {
          coupon_code: [{ message: 'coupon code not found' }],
        },
      },
      {
        data: {
          status: 'OK',
          result: {
            id: 235,
            name: {
              'en-CA': 'Test codes',
              'fr-CA': 'Le Nom',
            },
            description: {
              'en-CA': 'test codes description',
              'fr-CA': 'la description ici',
            },
            code_prefix: 'CAT',
            code_count: 100,
            starts_at: null,
            ends_at: null,
            state: 'REVIEW',
            currency_code: 'XRO-ADM',
            discount_rate: null,
            volume_discount_count: 1,
            bundle_item_offer_item_count: null,
            global_usage_cap_limit: 1,
            order_usage_cap_limit: null,
            member_usage_cap_limit: null,
            is_active: true,
            updated_at: '2023-04-20T20:29:27.556Z',
            created_at: '2023-04-20T20:29:27.556Z',
            eligible_item_filter_definition: null,
            bundle_offer_filter_definition: null,
            owner: {
              type: 'program',
              code: 'aeroplan_program',
            },
            discount_fixed: {
              amount: 100,
              currency_code: 'XRO-ADM',
            },
            minimum_purchase_amount: null,
          },
        },
        expected: {
          status: 'OK',
          result: {
            id: 235,
            name: {
              'en-CA': 'Test codes',
              'fr-CA': 'Le Nom',
            },
            description: {
              'en-CA': 'test codes description',
              'fr-CA': 'la description ici',
            },
            code_prefix: 'CAT',
            code_count: 100,
            starts_at: null,
            ends_at: null,
            state: 'REVIEW',
            currency_code: 'XRO-ADM',
            discount_rate: null,
            volume_discount_count: 1,
            bundle_item_offer_item_count: null,
            global_usage_cap_limit: 1,
            order_usage_cap_limit: null,
            member_usage_cap_limit: null,
            is_active: true,
            updated_at: '2023-04-20T20:29:27.556Z',
            created_at: '2023-04-20T20:29:27.556Z',
            eligible_item_filter_definition: null,
            bundle_offer_filter_definition: null,
            owner: {
              type: 'program',
              code: 'aeroplan_program',
            },
            discount_fixed: {
              amount: 100,
              currency_code: 'XRO-ADM',
            },
            minimum_purchase_amount: null,
          },
        },
      },
    ])('should clean message', ({ data, expected }) => {
      expect(cleanMessage(data)).toEqual(expected);
    });
  });
});
