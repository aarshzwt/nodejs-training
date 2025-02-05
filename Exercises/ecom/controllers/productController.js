const db = require("../models")
const { Product } = db


async function createProduct(req, res) {
    try {
        const { name, description, price, stock, category_id } = req?.body;
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
          }
        const image_url = `/uploads/${req.file.filename}`;

        const product = await Product.create({ name, description, price, stock, category_id, image_url });
        return res.status(200).json({ product: product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while creating the product." });
    }
}

module.exports = { createProduct }