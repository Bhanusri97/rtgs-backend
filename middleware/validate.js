const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: error.errors,
    });
  }
};

module.exports = validate;
