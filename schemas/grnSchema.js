const Joi = require("joi");

const grnSchema = Joi.object({
    grnID: Joi.string().required(),
    grnNote: Joi.string().max(199).required(),
    grnList: Joi.string().max(100).required(),
    isActive: Joi.boolean().required(),
    createdAt: Joi.number().max(100).required(),
    createdBy: Joi.string().max(100).required(),
    lastModified: Joi.number().max(100).required(),
    lastModifiedBy: Joi.string().max(100).required(),
});

module.exports = {
    grnSchema,
};
