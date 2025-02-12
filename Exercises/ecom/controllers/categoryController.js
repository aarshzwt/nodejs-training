const db = require("../models")
const { Category, Product } = db


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

//GET product by category controller function
async function getProductByCategory(req, res) {
    try {
        const category_id = req.params.category_id;
        const product = await Product.findAll({ where: { category_id } });
        if (product.length === 0) {
            return res.status(404).json({ message: `no product found with category_id: ${category_id}`, product: product });
        }
        return res.status(200).json({ product: product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while fetching the products." });
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
        const image_url = req.file ? `/uploads/image/${req.file.filename}` : null;
        const categoryData = { name, ...(image_url && { image_url }) };
        const category = await Category.create(categoryData);
        return res.status(201).json({ category: category });
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


module.exports = { getCategories,getProductByCategory,createCategory }