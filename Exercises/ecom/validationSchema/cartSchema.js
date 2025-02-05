const yup = require("yup");


const cartCreateSchema = yup.object({
  body: yup.object({
    product_id: yup.number("product_id must be int").required("product_id is required"),
    quantity: yup.string("quantity must be int").required("quantity is required")
  }),
  params: yup.object({
    id: yup.number().required("id is required").positive("id must be a positive integer")
  })
});

module.exports = { cartCreateSchema };
