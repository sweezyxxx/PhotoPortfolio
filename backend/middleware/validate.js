const Joi = require("joi");

exports.validatePhoto = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(2).required(),
    description: Joi.string().allow(""),
    tags: Joi.string().allow(""),
    category: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  next();
};