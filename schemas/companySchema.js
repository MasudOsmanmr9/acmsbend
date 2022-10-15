const Joi = require("joi");

const company = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().max(199).required(),
  location: Joi.string().max(100).required(),
  image: Joi.string().required(),
  createdAt: Joi.number().max(100).required(),
  createdBy: Joi.string().max(100).required(),
  lastModified: Joi.number().max(100).required(),
  lastModifiedBy: Joi.string().max(100).required(),
});

module.exports = {
  company,
};
