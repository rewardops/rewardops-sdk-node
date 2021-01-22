const yup = require('yup');

/**
 * Cancel order validation schema.
 *
 * @private
 */
const amountAndCurrencyCode = yup
  .array()
  .of(yup.object({ amount: yup.number().required(), currency_code: yup.string().required() }))
  .required();
const cancelOrderSchema = yup.object().shape({
  order_suppliers: yup.array().of(
    yup.object({
      supplier_id: yup.string().required(),
      fulfillment: yup.object().shape({
        member_paid: yup.array().of(yup.object({ amount: yup.number(), currency_code: yup.string() })),
        program_cost: amountAndCurrencyCode,
      }),
      order_items: yup
        .array()
        .of(
          yup.object({
            order_item_external_id: yup.string(),
            member_paid: amountAndCurrencyCode,
            program_cost: amountAndCurrencyCode,
          })
        )
        .required(),
    })
  ),
});

module.exports = {
  cancelOrderSchema,
};
