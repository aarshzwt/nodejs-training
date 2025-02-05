const yup = require("yup");


// const userGetSchema = yup.object({
//   query: yup.object({
//     order: yup.string().oneOf(["ASC", "DESC"], 'order must be from ["ASC", "DESC"]').optional(),
//     col: yup.string().oneOf(["name", "email", "age", "isActive", "createdAt"], 'column name must be from ["name", "email", "age", "isActive", "createdAt"]').optional(),
//   })
// })


const userCreateSchema = yup.object({
  body: yup.object({
    first_name: yup.string().required("first_name is required"),
    last_name: yup.string().required("last_name is required"),
    email: yup.string().email().required("email is required"),
    password: yup.string().required("password is required"),
    role: yup.string().oneOf(['admin', 'customer'], 'role must be from ["admin", "customer"]').required("role is required"),
  }),
});

const userLoginSchema = yup.object({
  body: yup.object({
    email: yup.string().email().required("email is required"),
    password: yup.string().required("password is required"),
  }),
});


const userUpdateSchema = yup.object({
  body: yup.object({
    first_name: yup.string().required("first_name is required"),
    last_name: yup.string().required("last_name is required"),
    email: yup.string().email().required("email is required"),
    password: yup.string().optional(),
  }),
});

module.exports = { userCreateSchema, userLoginSchema, userUpdateSchema };
