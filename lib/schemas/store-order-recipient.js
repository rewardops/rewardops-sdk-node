const yup = require('yup');

const storeOrderRecipientSchema = yup.object().shape({
  id: yup.number().required(),
  accept_language: yup
    .string()
    .oneOf(['en-CA', 'fr-CA'])
    .required(),
});

module.exports = {
  storeOrderRecipientSchema,
};
