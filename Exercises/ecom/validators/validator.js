const validator = (schema) => async (req, res, next) => {
    try {
        if (req.is('multipart/form-data')) { // Only run for form-data
            req.body = {
              ...req.body,
              price: req.body.price ? parseFloat(req.body.price) : undefined,
              stock: req.body.stock ? parseInt(req.body.stock, 10) : undefined,
              category_id: req.body.category_id ? parseInt(req.body.category_id, 10) : undefined,
              quantity: req.body.quantity ? parseInt(req.body.quantity, 10) : undefined,
            };
          }
        await schema.validate({
            body: req.body,
            params: req.params,
            query:req.query,
        }, { abortEarly: false });

        return next();
    } catch (error) {
        // Handle validation errors
        return res.status(400).json({
            type: error.name,
            message: error.errors || error.message, // Show all validation errors if there are multiple
        });
    }
};

module.exports = validator;
