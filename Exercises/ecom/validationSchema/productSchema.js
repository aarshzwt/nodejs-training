const yup = require("yup");

const productGetSchema = yup.object({
    query: yup.object({
      order: yup.string().oneOf(["ASC", "DESC"], 'order must be from ["ASC", "DESC"]').optional(),
      col: yup.string().oneOf(['name', 'description', 'price', 'stock', 'createdAt'], "column name must be from ['name', 'description', 'price', 'stock', 'createdAt']").optional(),
    })
  })

const productCreateSchema = yup.object({
    body: yup.object({
        name: yup.string().required("name is required"),
        brand: yup.string().required("brand is required"),
        description: yup.string().optional(),
        price: yup.number("price must be number").required("price is required").min(0, "Price must be 0 or a positive number"),
        stock: yup.number("stock must be number").required("stock is required").positive(),
        category_id: yup.number("category_id must be int").required("category_id is required").positive(),     
        image_url: yup.string("image_url must be string").optional()
    }),
});

const productUpdateSchema = yup.object({
    body: yup.object({
        name: yup.string().optional(),
        brand: yup.string().optional(),
        description: yup.string().optional(),
        price: yup.number("Price must be a number").optional().min(0, "Price must be 0 or a positive number"),
        stock: yup.number("stock must be number").optional().positive(),
        category_id: yup.number("category_id must be int").optional().positive(),
        image_url: yup.string("image_url must be string").optional()
    }),
    params: yup.object({
        id: yup.number().required("id is required").positive("id must be a positive integer")
    })
});

module.exports = { productGetSchema, productCreateSchema, productUpdateSchema };
