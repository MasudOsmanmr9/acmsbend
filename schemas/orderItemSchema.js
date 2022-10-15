const Joi = require("joi");

const orderItem = Joi.object({
    orderID: Joi.string().required(),
    unitPrice: Joi.number().required(),
    quantity: Joi.number().required(),
    isActive: Joi.boolean().required(),
    createdAt: Joi.number().max(100).required(),
    createdBy: Joi.string().max(100).required(),
    lastModified: Joi.number().max(100).required(),
    lastModifiedBy: Joi.string().max(100).required(),
});

module.exports = {
    orderItem,
};
