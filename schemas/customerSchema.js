const Joi = require("joi");

const customer = Joi.object({
    customerID: Joi.string().required(),
    name: Joi.string().max(199).required(),
    email: Joi.string().max(199).required(),
    address: Joi.string().max(100).required(),
    location: Joi.string().max(100).required(),
    image: Joi.string().required(),
    point: Joi.float().required(),
    isActive: Joi.boolean().required(),
    createdAt: Joi.number().max(100).required(),
    createdBy: Joi.string().max(100).required(),
    lastModified: Joi.number().max(100).required(),
    lastModifiedBy: Joi.string().max(100).required(),
});

module.exports = {
    customer,
};
