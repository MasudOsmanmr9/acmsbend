const Joi = require("joi");

const backStore = Joi.object({
    BAreaID: Joi.string().required(),
    BAreaName: Joi.string().max(199).required(),
    BAreadSize: Joi.string().max(100).required(),
    isActive: Joi.boolean().required(),
    createdAt: Joi.number().max(100).required(),
    createdBy: Joi.string().max(100).required(),
    lastModified: Joi.number().max(100).required(),
    lastModifiedBy: Joi.string().max(100).required(),
});

module.exports = {
    backStore,
};
