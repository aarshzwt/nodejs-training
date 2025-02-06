const yup = require("yup");

const userGetSchema = yup.object({
  query: yup.object({
    order: yup.string().oneOf(["ASC", "DESC"], 'order must be from ["ASC", "DESC"]').optional(),
    col: yup.string().oneOf(['first_name', 'email', 'last_name', 'role', 'createdAt'], "column name must be from ['first_name', 'email', 'last_name', 'role', 'createdAt']").optional(),
  })
})

const userCreateSchema = yup.object({
  body: yup.object({
    first_name: yup.string().required("first_name is required").matches(/^[A-Za-z]+$/, "first_name must only contain letters"),
    last_name: yup.string().required("last_name is required").matches(/^[A-Za-z]+$/, "last_name must only contain letters"),
    email: yup.string().email("email is not in proper format").required("email is required"),
    password: yup.string().required("password is required"),
    role: yup.string().oneOf(['admin', 'customer'], `role must be from ['admin', 'customer']`).required("role is required"),
  }),
});

const userLoginSchema = yup.object({
  body: yup.object({
    email: yup.string().email("email is not in proper format").required("email is required"),
    password: yup.string().required("password is required"),
  }),
});


const userUpdateSchema = yup.object({
  body: yup.object({
    first_name: yup.string().required("first_name is required").matches(/^[A-Za-z]+$/, "first_name must only contain letters"),
    last_name: yup.string().required("last_name is required").matches(/^[A-Za-z]+$/, "last_name must only contain letters"),
    email: yup.string().email("email is not in proper format").required("email is required"),
    password: yup.string().optional(),
  }),
});

module.exports = { userGetSchema, userCreateSchema, userLoginSchema, userUpdateSchema };
