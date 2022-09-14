const faker = require('faker');
const config = require('../../lib/config');

const { storeOrderRecipientSchema, isNumberOrString } = require('../../lib/schemas/store-order-recipient');
const { mockConfig } = require('../test-helpers/mock-config');

const testLocale = faker.random.locale();
const testNumber = faker.datatype.number();

describe('storeOrderRecipientSchema.validate()', () => {
  beforeEach(() => {
    config.reset();
    config.init(mockConfig({ supportedLocales: [testLocale] }));
  });

  test('it accepts a uuid as a id', () => {
    const params = { id: faker.datatype.uuid(), accept_language: testLocale };

    expect(storeOrderRecipientSchema.validateSync(params)).toEqual(params);
  });

  test('it accepts a number as a id', () => {
    const params = { id: testNumber, accept_language: testLocale };

    expect(storeOrderRecipientSchema.validateSync(params)).toEqual(params);
  });

  test('it does not reject an id that is an empty string', async () => {
    // Pangea does not have any validation on the member.id, it even allows for empty memberIds. Hence this should be the expected behavior.
    const params = { id: '', accept_language: testLocale };

    await expect(storeOrderRecipientSchema.validateSync(params)).toEqual(params);
  });

  test('it should not reject an id that is undefined', async () => {
    // Pangea does not have any validation on the member.id, it even allows for empty memberIds. Hence this should be the expected behavior.
    const params = { id: undefined, accept_language: testLocale };

    await expect(storeOrderRecipientSchema.validate(params)).rejects.toThrowError('id is a required field');
  });

  test('it reject if the given locale is not supported', async () => {
    const params = { id: testNumber, accept_language: faker.random.locale() };

    await expect(storeOrderRecipientSchema.validate(params)).rejects.toThrowError('Locale is not supported');
  });

  test('it reject if the given locale is undefined', async () => {
    const params = { id: testNumber, accept_language: undefined };

    await expect(storeOrderRecipientSchema.validate(params)).rejects.toThrowError(
      'accept_language is a required field'
    );
  });
});

describe('isNumberOrUuid', () => {
  test.each`
    value                       | expected
    ${{}}                       | ${false}
    ${[]}                       | ${false}
    ${{ foo: 42 }}              | ${false}
    ${[1, 2, 3]}                | ${false}
    ${null}                     | ${false}
    ${undefined}                | ${false}
    ${-100}                     | ${true}
    ${''}                       | ${true}
    ${'fakeUuid'}               | ${true}
    ${faker.datatype.boolean()} | ${false}
    ${faker.datatype.number()}  | ${true}
    ${faker.datatype.uuid()}    | ${true}
  `('given $value, $expected is returned', ({ value, expected }) => {
    expect(isNumberOrString(value)).toBe(expected);
  });
});
