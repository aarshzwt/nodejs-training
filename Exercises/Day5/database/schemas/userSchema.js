const yup = require("yup");

const userSchema = yup.object({
  body: yup.object({
    id: yup.number().required(),
    name: yup.string().required("name is required"),
    email: yup.string().email().required("email is required"),
    age: yup.number().required("age is required"),
    role: yup.string().required("role is required"),
    isActive: yup.string().required("isActive is required"),
  }),
  params: yup.object({
    id: yup.number().required("id must be positive integer").positive("id must be a positive integer"),
  }),
});

module.exports = { userSchema };
