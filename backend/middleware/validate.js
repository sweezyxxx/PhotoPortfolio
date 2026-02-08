const Joi = require("joi");

/* =======================
   AUTH VALIDATION
======================= */
exports.validateRegister = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 30 characters',
      'any.required': 'Username is required'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

exports.validateLogin = (req, res, next) => {
  const schema = Joi.object({
    login: Joi.string().required().messages({
      'any.required': 'Username or email is required'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

/* =======================
   USER VALIDATION
======================= */
exports.validateProfileUpdate = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).messages({
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 30 characters'
    }),
    email: Joi.string().email().messages({
      'string.email': 'Please provide a valid email address'
    })
  }).min(1).messages({
    'object.min': 'At least one field (username or email) must be provided'
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

/* =======================
   PHOTO VALIDATION
======================= */
exports.validatePhoto = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(2).required(),
    description: Joi.string().allow(""),
    tags: Joi.string().allow(""),
    category: Joi.string().required(),
    orientation: Joi.string().valid("vertical", "horizontal").required()
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