const yup = require("yup");


const wishlistCreateSchema = yup.object({
  body: yup.object({
    product_id: yup.number("product_id must be number").required("product_id is required").integer("product_id must be int"),
  }),
});

module.exports = { wishlistCreateSchema };
