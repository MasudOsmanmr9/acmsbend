const Joi = require("joi");

const employee = Joi.object({
    employeeID: Joi.string().required(),
    name: Joi.string().max(199).required(),
    address: Joi.string().max(100).required(),
    designation: Joi.string().max(100).required(),
    joinDate: Joi.string().max(100).required(),
    contact: Joi.string().max(100).required(),
    LegalContact: Joi.string().max(100).required(),
    image: Joi.string().required(),
    employeeVerifiedDocument: Joi.string().required(),
    employeeNID: Joi.string().required(),
    employeeRefBy: Joi.string(),
    createdAt: Joi.number().max(100).required(),
    createdBy: Joi.string().max(100).required(),
    lastModified: Joi.number().max(100).required(),
    lastModifiedBy: Joi.string().max(100).required(),
});

module.exports = {
    employee,
};
