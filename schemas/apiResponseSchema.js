const Joi = require("joi");

const apiResponse = Joi.object({
  Success: Joi.boolean(),
  Message: Joi.string(),
  Data: Joi.any(),
});

module.exports = {
  apiResponse,
};
