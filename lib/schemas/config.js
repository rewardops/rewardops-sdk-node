const yup = require('yup');

const configSchema = yup.object().shape({
  apiServerUrl: yup
    .string()
    .url()
    .nullable(),
  apiVersion: yup
    .string()
    .oneOf(['v3', 'v4', 'v5'])
    .required(),
  piiServerUrl: yup
    .string()
    .url()
    .nullable()
    .default(null),
  clientId: yup.string().required(),
  clientSecret: yup.string().required(),
  logFilePath: yup.string().required(),
  logToFile: yup.boolean().required(),
  timeout: yup
    .number()
    .positive()
    .required(),
  verbose: yup.boolean().required(),
  quiet: yup.boolean().required(),
  supportedLocales: yup.array().nullable(),
});

module.exports = {
  configSchema,
};
