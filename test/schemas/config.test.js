const { omit } = require('lodash');

const { configSchema } = require('../../lib/schemas/config');
const { mockConfig } = require('../test-helpers/mock-config');

const validConfig = mockConfig();

describe('configSchema.validate()', () => {
  test('it accepts a valid config', () => {
    expect(configSchema.isValidSync(validConfig)).toEqual(true);
  });

  test('`apiVersion` must be a supported version', () => {
    const testConfig = { ...validConfig, apiVersion: 9000 };

    expect(configSchema.isValidSync(testConfig)).toEqual(false);
  });

  test('`piiServerUrl` defaults to null if undefined', () => {
    const testConfig = { ...validConfig, piiServerUrl: undefined };

    expect(configSchema.validateSync(testConfig)).toEqual(expect.objectContaining({ piiServerUrl: null }));
  });
});

describe('required properties', () => {
  test.each`
    field                 | expected
    ${'apiServerUrl'}     | ${true}
    ${'apiVersion'}       | ${false}
    ${'clientId'}         | ${false}
    ${'clientSecret'}     | ${false}
    ${'logFilePath'}      | ${false}
    ${'logToFile'}        | ${false}
    ${'timeout'}          | ${false}
    ${'verbose'}          | ${false}
    ${'piiServerUrl'}     | ${true}
    ${'supportedLocales'} | ${true}
    ${'quiet'}            | ${false}
  `('given $field is missing, test `isValid` returns $expected', ({ field, expected }) => {
    const testConfig = omit(validConfig, [field]);

    expect(configSchema.isValidSync(testConfig)).toBe(expected);
  });
});
