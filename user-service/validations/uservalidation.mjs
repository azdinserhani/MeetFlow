import Joi from "joi";

export const userValidationSchema = Joi.object({
  first_name: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.alphanum": "First name must only contain alpha-numeric characters.",
    "string.min": "First name must be at least 3 characters long.",
    "string.max":
      "First name must be less than or equal to 30 characters long.",
    "any.required": "First name is required.",
  }),
  last_name: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.alphanum": "Last name must only contain alpha-numeric characters.",
    "string.min": "Last name must be at least 3 characters long.",
    "string.max": "Last name must be less than or equal to 30 characters long.",
    "any.required": "Last name is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address.",
    "any.required": "Email is required.",
  }),
  profile_img: Joi.string().uri().optional().messages({
    "string.uri": "Profile image must be a valid URI.",
  }),
});
