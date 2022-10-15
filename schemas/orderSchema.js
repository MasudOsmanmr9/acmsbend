const Joi = require("joi");

const order = Joi.object({
    orderID: Joi.string().required(),
    orderNumber: Joi.string().max(199).required(),
    orderDate: Joi.date().required(),
    totalAmount: Joi.float().required(),
    isActive: Joi.boolean().required(),
    createdAt: Joi.number().max(100).required(),
    createdBy: Joi.string().max(100).required(),
    lastModified: Joi.number().max(100).required(),
    lastModifiedBy: Joi.string().max(100).required(),
});

module.exports = {
    order,
};
