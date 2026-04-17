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
    .required(),

});

const orderStatusSchema = Joi.object({
    status: Joi.string()
    .valid('active', 'completed', 'cancelled')
    .required()
});

module.exports = {
    orderSchema,
    orderStatusSchema
};