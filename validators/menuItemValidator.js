const Joi = require('joi');

const menuItemSchema = Joi.object({
  name: Joi.string()
  .min(3)
  .max(100)
  .required(),    

 price: Joi.number()
 .positive()
 .required(),

 restaurantId: Joi.number()
 .integer()
 .required(),
});

module.exports = menuItemSchema;
