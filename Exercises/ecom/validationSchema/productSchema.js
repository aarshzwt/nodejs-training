const yup = require("yup");


const productCreateSchema = yup.object({
    body: yup.object({
        name: yup.string().required("name is required"),
        description: yup.string().optional(),
        price: yup.number("price must be number").required("price is required").positive(),
        stock: yup.number("stock must be number").required("stock is required").positive(),
        category_id: yup.number("category_id must be int").required("category_id is required").positive(),
        quantity: yup.number("quantity must be int").required("quantity is required").positive(),
        image_url: yup.string("image_url must be string").optional()
    }),
});

const productUpdateSchema = yup.object({
    body: yup.object({
        name: yup.string().optional(),
        description: yup.string().optional(),
        price: yup.number("price must be number").optional().positive(),
        stock: yup.number("stock must be number").optional().positive(),
        category_id: yup.number("category_id must be int").optional().positive(),
        quantity: yup.number("quantity must be int").optional().positive(),
        image_url: yup.string("image_url must be string").optional()
    }),
    params: yup.object({
        id: yup.number().required("id is required").positive("id must be a positive integer")
    })
});

module.exports = { productCreateSchema, productUpdateSchema };
