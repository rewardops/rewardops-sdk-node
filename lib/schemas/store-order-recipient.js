const yup = require('yup');
const config = require('../config');

const storeOrderRecipientSchema = yup.object().shape({
  id: yup.number().required(),
  accept_language: yup
    .string()
    .oneOf(config.get('supportedLocales'))
    .required(),
});

module.exports = {
  storeOrderRecipientSchema,
};
