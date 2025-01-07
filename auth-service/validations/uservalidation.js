import Joi from 'joi';

export const userValidationSchema = Joi.object({
    first_name: Joi.string().alphanum().min(3).max(30).required().messages({
        'string.alphanum': 'First name must only contain alpha-numeric characters.',
        'string.min': 'First name must be at least 3 characters long.',
        'string.max': 'First name must be less than or equal to 30 characters long.',
        'any.required': 'First name is required.'
    }),
    last_name: Joi.string().alphanum().min(3).max(30).required().messages({
        'string.alphanum': 'Last name must only contain alpha-numeric characters.',
        'string.min': 'Last name must be at least 3 characters long.',
        'string.max': 'Last name must be less than or equal to 30 characters long.',
        'any.required': 'Last name is required.'
    }),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required().messages({
        'string.pattern.base': 'Password must be between 3 and 30 characters long and contain only alpha-numeric characters.',
        'any.required': 'Password is required.'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email address.',
        'any.required': 'Email is required.'
    }),
});
