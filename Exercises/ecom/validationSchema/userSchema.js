const yup = require("yup");


// const userGetSchema = yup.object({
//   query: yup.object({
//     order: yup.string().oneOf(["ASC", "DESC"], 'order must be from ["ASC", "DESC"]').optional(),
//     col: yup.string().oneOf(["name", "email", "age", "isActive", "createdAt"], 'column name must be from ["name", "email", "age", "isActive", "createdAt"]').optional(),
//   })
// })

// const userGetByIdSchema = yup.object({
//   params: yup.object({
//     id: yup.number().required("id is required").positive("id must be a positive integer") 
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

// const userLoginSchema = yup.object({
//   body: yup.object({
//     email: yup.string().email().required("email is required"),
//     password: yup.string().required("password is required"),
//   }),
// });

// const userUpdateSchema = yup.object({
//   body: yup.object({
//     name: yup.string().optional(),
//     email: yup.string().email().optional(),
//     password: yup.string().optional(),
//     age: yup.number().optional().min(5).max(120),
//     role: yup.string().oneOf(["User", "Admin"], 'role must be from ["User", "Admin"]').optional(),
//     isActive: yup.string().optional(),
//   }),
//   params: yup.object({
//     id: yup.number().required("id is required").positive("id must be a positive integer"),
//   }),
// });


// const userProfileSchema = yup.object({
//   body: yup.object({
//     bio: yup.string().required("bio is required"),
//     linkedInUrl: yup.string().url().required("linkedInUrl is required"),
//     facebookUrl: yup.string().url().required("facebookUrl is required"),
//     instaUrl: yup.string().url().required("instaUrl is required"),
//   }),
//   params: yup.object({
//     userId: yup.number().required("id is required").positive("id must be a positive integer"),
//   }),
// });
module.exports = { userCreateSchema };
