const yup = require('yup');
const config = require('../config');

const storeOrderRecipientSchema = yup.object().shape({
  id: yup
    .string()
    .required()
    .matches(/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})|[0-9]+$/),
  accept_language: yup
    .string()
    .required()
    .test('is-valid-locale', 'Locale is not supported', locale =>
      config.get('supportedLocales') ? config.get('supportedLocales').includes(locale) : true
    ),
});

module.exports = {
  storeOrderRecipientSchema,
};
