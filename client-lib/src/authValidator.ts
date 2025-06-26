import Joi from "joi";

export const authSchema = Joi.object({
  username: Joi.string().min(3).required().messages({
    "string.base": `"username" must be a string`,
    "string.min": `"username" should have at least 3 characters`,
    "any.required": `"username" is required`,
  }),
  password: Joi.string().min(4).required().messages({
    "string.min": `"password" should have at least 4 characters`,
    "any.required": `"password" is required`,
  }),
});