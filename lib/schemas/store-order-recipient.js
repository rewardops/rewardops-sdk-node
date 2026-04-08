const { every } = require('lodash');
const yup = require('yup');

const config = require('../config');

/**
 * Predicate validation helper for Reward Ops item IDs.
 * Pangea does not have any strict validation for the member.id param.
 * So we are just validating if its a number or string
 *
 * @param {*} value Value being tested
 *
 * @returns {boolean} True if value is a string or number, false otherwise
 *
 * @private
 */
const isNumberOrString = value => every([['number', 'string'].includes(typeof value)]);

/**
 * Store order recipient validation schema.
 *
 * @private
 */
const storeOrderRecipientSchema = yup.object().shape({
  id: yup
    .mixed()
    .required()
    .test('is-valid-id', 'ID must be a number or string', isNumberOrString),
  accept_language: yup
    .string()
    .required()
    .test('is-valid-locale', 'Locale is not supported', locale =>
      config.get('supportedLocales') ? config.get('supportedLocales').includes(locale) : true
    ),
});

module.exports = {
  storeOrderRecipientSchema,
  isNumberOrString,
};
