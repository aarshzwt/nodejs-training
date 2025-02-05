const db = require("../models")
const { Product } = db
const path = require('path')
const fs = require('fs')

async function getProducts(req, res) {
    try {
        const products = await Product.findAll();
        if (products.lenth === 0) {
            return res.status(404).json({ message: "no products found" });
        }
        return res.status(200).json({ products: products });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while fetching the products." });
    }
}

async function getProductById(req, res) {
    try {
        const id = req.params.id;
        const product = await Product.findOne({ where: { id } });
        if (!product) {
            return res.status(404).json({ message: `no product found with id: ${id}` });
        }
        return res.status(200).json({ product: product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while fetching the products." });
    }
}


async function createProduct(req, res) {
    try {
        const { name, description, price, stock, category_id } = req?.body;
        const image_url = req.file ? `/uploads/image/${req.file.filename}` : null;

        const product = image_url === null ? await Product.create({ name, description, price, stock, category_id })
            : await Product.create({ name, description, price, stock, category_id, image_url });
        return res.status(200).json({ product: product });
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                message: `provided Category doesn't exists. Please choose a valid category.`,
            });
        }
        console.error(error);
        return res.status(500).json({ message: "An error occurred while creating the product." });
    }
}

async function updateProduct(req, res) {
    try {
        const id = req.params.id;

        const product = await Product.findOne({ where: { id } });
        if (!product) {
            return res.status(404).json({ message: `Product doesn't exists. Please choose a valid product.` });
        }
        const oldImagePath = product.image_url ? path.join(__dirname, '..','..','..', product.image_url) : null;

        const { name, description, price, stock, category_id } = req?.body;
        const image_url = req.file ? `/uploads/image/${req.file.filename}` : null;
        const updateData = {
            ...(name) && { name: name },
            ...(description) && { description: description },
            ...(price) && { price: price },
            ...(stock) && { stock: stock },
            ...(category_id) && { category_id: category_id },
            ...(image_url) && { image_url: image_url },
        };
        const [affectedRows] = await Product.update(updateData,
            {
                where: { id },
            });
            console.log(affectedRows);
        if (affectedRows > 0) {
            if (image_url && oldImagePath && oldImagePath !== path.join(__dirname, '..','..','..', image_url)) {
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath); // Delete the old image file
                }
            }
            const updatedProduct = await Product.findOne({ where: { id } });
            return res.status(200).json({
                message: "Product Updated Successfully",
                updatedProduct: updatedProduct,
            });
        } else {
            return res.status(500).json({ message: "Error updating the product." });
        }
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            // Delete the uploaded image if the update fails
            if (req.file) {
                const uploadedImagePath = path.join(__dirname, '..', '..', '..', '/uploads/image', req.file.filename);
                if (fs.existsSync(uploadedImagePath)) {
                    fs.unlinkSync(uploadedImagePath); 
                }
            }
            return res.status(404).json({
                message: `provided Category doesn't exists. Please choose a valid category.`,
            });
        }
        console.error(error);
        return res.status(500).json({ message: "An error occurred while updating the product." });
    }
}

async function deleteProduct(req, res) {
    try {
        const id = req.params.id;
        const product = await Product.findOne({ where: { id } });
        if (!product) {
            return res.status(404).json({ message: `No product found with id: ${id}.` })
        }
        //Product image that is to be deleted
        const imagePath = path.join(__dirname,'..','..','..', product.image_url);
        if(fs.existsSync(imagePath)){
            fs.unlinkSync(imagePath);
        }

        const deletedProduct = await Product.destroy({ where: { id } });
        return res.status(200).json({ message: "User deleted Successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred while deleting the product.", error: error });

    }
}

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct }