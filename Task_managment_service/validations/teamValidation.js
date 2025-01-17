import Joi from "joi";

export const teamValidationSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  description: Joi.string().max(255).required(),
  team_img: Joi.string().uri().optional(),
});

