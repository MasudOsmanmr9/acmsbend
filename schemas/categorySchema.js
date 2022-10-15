const Joi = require("joi");
const subCategory = require("../schemas/subCategoriesSchema");

const category = Joi.object({
  id: Joi.string().max(50).required(),
  name: Joi.string().max(200).required(),
  image: Joi.string().required(),
  // subCategories: Joi.array().items(subCategory.subCategories).required(), // array object over here
  createdAt: Joi.number().max(100).required(),
  createdBy: Joi.string().max(100).required(),
  lastModified: Joi.number().max(100).required(),
  lastModifiedBy: Joi.string().max(100).required(),
});

module.exports = {
  category,
};
