const mockDate = require('mockdate');

const config = require('../../lib/config');
const { log } = require('../../lib/utils/logger');

// test setup
const timestamp = Date.now();

const originalConsole = console;
const mockConsole = { log: jest.fn() };
// freeze time
mockDate.set(timestamp);

describe('log()', () => {
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

    expect(mockConsole.log).toHaveBeenCalledWith(
      expect.stringContaining(`RewardOps SDK INFO[${expectedDate.toISOString()}] testLog`)
    );
  });

  test('options.level is present in the log', () => {
    log('errorLog', { level: 'error' });

    expect(mockConsole.log).toHaveBeenCalledWith(
      expect.stringContaining(`RewardOps SDK ERROR[${expectedDate.toISOString()}] errorLog`)
    );
  });

  test('instances of Error are parsed into the log', () => {
    const error = new Error();
    error.message = 'errorMessage';
    error.stack = 'errorStack';

    log(error);

    expect(mockConsole.log).toHaveBeenCalledWith(
      expect.stringContaining(`RewardOps SDK ERROR[${expectedDate.toISOString()}] ${error.message}\n${error.stack}`)
    );
  });

  describe('logger levels', () => {
    test('options.meta is present in the log when verbose is true', () => {
      config.set('verbose', true);

      log('testLog', { meta: { foo: 'bar' } });

      expect(mockConsole.log).toHaveBeenCalledWith(expect.stringContaining('"foo": "bar"'));
    });

    test('options.meta is not present in the log when verbose is false', () => {
      config.set('verbose', false);

      log('testLog', { meta: { foo: 'bar' } });

      expect(mockConsole.log).toHaveBeenCalledWith(expect.not.stringContaining('"foo": "bar"'));
    });

    test('nothing is logged when loggerMode = quiet', () => {
      config.set('quiet', true);

      log('testLog', { meta: { foo: 'bar' } });

      expect(mockConsole.log).not.toHaveBeenCalled();
    });
  });
});
