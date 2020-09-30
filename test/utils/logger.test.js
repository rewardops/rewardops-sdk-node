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
  beforeAll(() => {
    // eslint-disable-next-line no-global-assign
    console = mockConsole;
    config.set('loggerMode', 'normal');
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

  describe('loggerMode', () => {
    test('options.meta is present in the log when loggerMode = verbose', () => {
      config.set('loggerMode', 'verbose');

      log('testLog', { meta: { foo: 'bar' } });

      expect(mockConsole.log).toHaveBeenCalledWith(expect.stringContaining('"foo": "bar"'));
    });

    test('options.meta is not present in the log when loggerMode = normal', () => {
      config.set('loggerMode', 'normal');

      log('testLog', { meta: { foo: 'bar' } });

      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining(`RewardOps SDK INFO[${expectedDate.toISOString()}] testLog`)
      );
    });

    test('nothing is logged when loggerMode = quiet', () => {
      config.set('loggerMode', 'quiet');

      log('testLog', { meta: { foo: 'bar' } });

      expect(mockConsole.log).not.toHaveBeenCalled();
    });
  });
});
