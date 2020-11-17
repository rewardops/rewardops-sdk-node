const yup = require('yup');

// Add URL once this is resolved: https://github.com/jquense/yup/issues/800
const configSchema = yup.object().shape({
  apiServerUrl: yup.string().nullable(),
  apiVersion: yup
    .string()
    .oneOf(['v3', 'v4', 'v5'])
    .required(),
  piiServerUrl: yup
    .string()
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
