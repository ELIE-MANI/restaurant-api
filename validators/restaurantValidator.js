const Joi = require('joi');

const restaurantSchema = Joi.object({
    name: Joi.string()
    .min(3)
    .max(100)
    .required()
});

module.exports = restaurantSchema;