const db = require("../models")
const { Category } = db


//GET all category controller function
async function getCategories(req, res) {
    try {
        const categories = await Category.findAll();
        if (categories.length === 0) {
            return res.status(404).json({ message: "No categories found." });
        }
        return res.status(200).json({ categories: categories });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message });
    }

}

//POST category controller function
async function createCategory(req, res) {
    try {
        const name = req.body.name;
        if(!name){
            return res.status(400).json({
                message: `name is required`,
              });
        }
        const category = await Category.create({ name });
        return res.status(200).json({ category: category });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
              message: `Category already exists. Please choose a different category.`,
            });
          }
        console.error(error);
        return res.status(500).json({ message: "An error occurred while creating the category." });
    }
}


module.exports = { getCategories, createCategory }