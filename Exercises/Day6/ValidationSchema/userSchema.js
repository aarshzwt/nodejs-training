const yup = require("yup");

const userCreateSchema = yup.object({
  body: yup.object({
    name: yup.string().required("name is required"),
    email: yup.string().email().required("email is required"),
    age: yup.number().required("age is required"),
    role: yup.string().oneOf(["User", "Admin"], 'role must be from ["User", "Admin"]').required("role is required"),
    isActive: yup.string().required("isActive is required"),
  }),
});

const userUpdateSchema = yup.object({
  body: yup.object({
    name: yup.string().optional(),
    email: yup.string().email().optional(),
    age: yup.number().optional().min(5).max(120),
    role: yup.string().oneOf(["User", "Admin"], 'role must be from ["User", "Admin"]').optional(),
    isActive: yup.string().optional(),
  }),
  params: yup.object({
    id: yup.number().required("id is required").positive("id must be a positive integer"),
  }),
});


const userProfileSchema = yup.object({
  body: yup.object({
    bio: yup.string().required("bio is required"),
    linkedInUrl: yup.string().url().required("linkedInUrl is required"),
    facebookUrl: yup.string().url().required("facebookUrl is required"),
    instaUrl: yup.string().url().required("instaUrl is required"),
  }),
  params: yup.object({
    id: yup.number().required("id is required").positive("id must be a positive integer"),
  }),
});
module.exports = { userCreateSchema, userUpdateSchema, userProfileSchema };
