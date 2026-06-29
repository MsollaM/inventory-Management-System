const { z, idParam, role } = require('./commonSchemas');

const registerSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(255).transform((v) => v.toLowerCase()),
    password: z.string().min(8).max(128),
  }),
});

const adminCreateUserSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(255).transform((v) => v.toLowerCase()),
    password: z.string().min(8).max(128),
    role: role.default('standard_user'),
  }).strict(),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email().max(255).transform((v) => v.toLowerCase()),
    password: z.string().min(1).max(128),
  }),
});

const approveSchema = idParam.extend({
  body: z.object({
    role: role.optional(),
  }).strict(),
});

module.exports = {
  registerSchema,
  adminCreateUserSchema,
  loginSchema,
  approveSchema,
  idParam,
};
