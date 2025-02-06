const yup = require("yup");


const orderUpdateSchema = yup.object({
  body: yup.object({
    status: yup.string("quantity must be int").oneOf(['pending', 'shipped', 'delivered', 'canceled'], `status must be from ['pending', 'shipped', 'delivered', 'canceled']`).required("status is required"),
  }),
});

module.exports = { orderUpdateSchema };
