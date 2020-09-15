const yup = require('yup');
const config = require('../config');

const storeOrderRecipientSchema = yup.object().shape({
  id: yup.number().required(),
  accept_language: yup
    .string()
    .required()
    .test('is-valid-locale', 'Locale is not supported', () =>
      config.get('supportedLocales') ? yup.string().oneOf(config.get('supportedLocales')) : true
    ),
});

module.exports = {
  storeOrderRecipientSchema,
};
