import Joi from "joi";

export const teamValidationSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  description: Joi.string().max(255),
  team_img: Joi.string().optional(),
});
export const projectValidationSchema = Joi.object({
  team_id: Joi.required(),
  name: Joi.string().min(3).max(30).required(),
  description: Joi.string().max(255).optional(),
  status: Joi.string().valid('active', 'inactive').required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().optional(),
  
});