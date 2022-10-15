const Joi = require("joi");

const bin = Joi.object({
    binID: Joi.string().required(),
    binName: Joi.string().max(199).required(),
    binType: Joi.string().max(199).required(),
    isActive: Joi.boolean().required(),
    createdAt: Joi.number().max(100).required(),
    createdBy: Joi.string().max(100).required(),
    lastModified: Joi.number().max(100).required(),
    lastModifiedBy: Joi.string().max(100).required(),
});

module.exports = {
    bin,
};
