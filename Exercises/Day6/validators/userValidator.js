const userValidator = (schema) => async (req, res, next) => {
    try {
        await schema.validate({
            body: req.body,
            params: req.params,
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

module.exports = userValidator;
