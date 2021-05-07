const Joi = require("joi");

//register validation

const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    role: Joi.string().min(2).required(),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

const itemValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    timeToPrep: Joi.number().required(),
    type: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.itemValidation = itemValidation;
