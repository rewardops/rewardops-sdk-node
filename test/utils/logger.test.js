const mockDate = require('mockdate');

const config = require('../../lib/config');

const { log, LOG_PREFIX } = jest.requireActual('../../lib/utils/logger');

// test setup
const timestamp = Date.now();

const originalConsole = console;
const mockConsole = { log: jest.fn() };
// freeze time
mockDate.set(timestamp);

describe('#log', () => {
  beforeEach(() => {
    // eslint-disable-next-line no-global-assign
    console = mockConsole;
    config.set('quiet', false);
    config.set('verbose', true);
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
      config.set('verbose', true);

      log('testLog', { meta: { foo: 'bar' } });

      expect(mockConsole.log).toHaveBeenCalledWith(expect.stringContaining('"foo": "bar"'));
    });

    test('options.meta is not present in the log when `verbose` is `false`', () => {
      config.set('verbose', false);

      log('testLog', { meta: { foo: 'bar' } });

      expect(mockConsole.log).toHaveBeenCalledWith(expect.not.stringContaining('"foo": "bar"'));
    });

    test('message is logged when `quiet` is true', () => {
      config.set('quiet', true);

      log('testLog');

      expect(mockConsole.log).toHaveBeenCalledWith(expect.stringContaining('testLog'));
    });
  });
});
