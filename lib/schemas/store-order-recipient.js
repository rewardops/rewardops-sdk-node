const { every } = require('lodash');
const yup = require('yup');

const config = require('../config');

/**
 * Predicate validation helper for Reward Ops item IDs.
 *
 * @param {*} value Value being tested
 *
 * @returns {boolean} True if value is a positive number or UUID, false otherwise
 *
 * @private
 */
const isNumberOrUuid = value =>
  every([
    ['number', 'string'].includes(typeof value),
    yup
      .number()
      .positive()
      .isValidSync(value) ||
      yup
        .string()
        .uuid()
        .isValidSync(value),
  ]);

/**
 * Store order recipient validation schema.
 *
 * @private
 */
const storeOrderRecipientSchema = yup.object().shape({
  id: yup
    .mixed()
    .required()
    .test('is-valid-id', 'ID must be a number or UUID', isNumberOrUuid),
  accept_language: yup
    .string()
    .required()
    .test('is-valid-locale', 'Locale is not supported', locale =>
      config.get('supportedLocales') ? config.get('supportedLocales').includes(locale) : true
    ),
});

module.exports = {
  storeOrderRecipientSchema,
  isNumberOrUuid,
};
