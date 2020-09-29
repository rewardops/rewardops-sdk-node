const faker = require('faker');
const config = require('../../lib/config');

const { storeOrderRecipientSchema } = require('../../lib/schemas/store-order-recipient');

const testLocale = faker.random.locale();
const testNumber = faker.random.number();

describe('storeOrderRecipientSchema.validate()', () => {
  beforeEach(() => {
    config.set('supportedLocales', [testLocale]);
  });

  test('it accepts a uuid as a id', () => {
    const object = { id: faker.random.uuid(), accept_language: testLocale };

    expect(storeOrderRecipientSchema.validateSync(object)).toEqual(object);
  });

  test('it accepts a number as a id', () => {
    const object = { id: testNumber, accept_language: testLocale };

    expect(storeOrderRecipientSchema.validateSync(object)).toEqual({
      id: String(testNumber),
      accept_language: testLocale,
    });
  });

  test('it reject an id that is an empty string', async () => {
    const object = { id: '', accept_language: testLocale };

    await expect(storeOrderRecipientSchema.validate(object)).rejects.toThrowError('id is a required field');
  });

  test('it reject an id that is undefined', async () => {
    const object = { id: undefined, accept_language: testLocale };

    await expect(storeOrderRecipientSchema.validate(object)).rejects.toThrowError('id is a required field');
  });

  test('it reject if the given locale is not supported', async () => {
    const object = { id: testNumber, accept_language: faker.random.locale() };

    await expect(storeOrderRecipientSchema.validate(object)).rejects.toThrowError('Locale is not supported');
  });

  test('it reject if the given locale is undefined', async () => {
    const object = { id: testNumber, accept_language: undefined };

    await expect(storeOrderRecipientSchema.validate(object)).rejects.toThrowError(
      'accept_language is a required field'
    );
  });
});
