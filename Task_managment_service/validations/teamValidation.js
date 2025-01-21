import Joi from "joi";

export const teamValidationSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  description: Joi.string().max(255),
  team_img: Joi.string().optional(),
});
