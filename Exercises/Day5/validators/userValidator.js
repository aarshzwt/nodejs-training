const userValidator = (schema) => async (req, res, next) => {
    try {
      // Validate body
      await schema.body.validate(req.body, { abortEarly: false });
  
      // Validate params
      await schema.params.validate(req.params, { abortEarly: false });
  
      return next();  // Proceed to the next middleware/controller if validation is successful
    } catch (error) {
      // Handle validation errors
      return res.status(400).json({
        type: error.name,
        message: error.errors || error.message, // Show all validation errors if there are multiple
      });
    }
  };
  
  module.exports = userValidator;
  