const Joi = require('joi');

const orderSchema = Joi.object({

    customerId: Joi.number()
    .integer()
    .required(),

    restaurantId: Joi.number()
    .integer()
    .required(),

    items: Joi.array()
    .items(Joi.object({
        menuItemId: Joi.number()
        .integer()
        .required(),

        quantity: Joi.number()
        .integer()  
        .positive()
        .required()
    }))
    .min(1)
    .required()

});

module.exports = orderSchema;