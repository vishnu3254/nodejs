const {z} = require('zod');

const signupSchema = z.object({
    username: z.string().min(3, "username must be at least 3 characters long"),
    password: z.string().min(6, "password must be at least 6 characters long"),
})

const loginSchema = z.object({
  username: z.string().min(1, "username is required"),
  password: z.string().min(1, "password is required"),
});

module.exports = {
  signupSchema,
  loginSchema,
}