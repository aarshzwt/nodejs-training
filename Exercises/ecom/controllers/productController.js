const db = require("../models")
const { Product, Category } = db
const path = require('path')
const fs = require('fs')

//GET all products controller function
async function getProducts(req, res) {
    try {
        //pagination details
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;

        const totalProducts = await Product.count();

        const { name, maxPrice, stock } = req?.query;

        //sorting based on column & order
        const order = req?.query.order || 'ASC';
        const col = req?.query.col || 'createdAt';

        //filter with name,price and stock
        const filters = {
            ...(name && { name: name }),
            ...(maxPrice && { price: { [db.Sequelize.Op.lte]: parseInt(maxPrice, 10) } }), //returns products with lower or equals to price than given
            ...(stock && { stock: { [db.Sequelize.Op.gte]: parseInt(stock, 10) } }) //returns products with higher or equals to stock than given
        };

        const products = await Product.findAll({
            where: filters,
            limit: limit,
            offset: offset,
            order: [[col, order]]
        });

        if (products.length === 0) {
            return res.status(404).json({ message: "no products found" });
        }

        const totalPages = Math.ceil(totalProducts / limit);

        return res.status(200).json({
            products: products,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: totalProducts,
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while fetching the products." });
    }
}

//GET product by id controller function
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

//GET product by category controller function
async function getProductByCategory(req, res) {
    try {
        const category_id = req.params.category_id;
        const product = await Product.findAll({ where: { category_id } });
        if (product.length === 0) {
            return res.status(404).json({ message: `no product found with category_id: ${category_id}` });
        }
        return res.status(200).json({ product: product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while fetching the products." });
    }
}

//POST product controller function
async function createProduct(req, res) {
    try {
        const { name, brand, description, price, stock, category_id } = req?.body;

        const image_url = req.file ? `/uploads/image/${req.file.filename}` : null;

        const validCategory = await Category.findOne({ where: { id: category_id } });
        if (!validCategory) {
            return res.status(404).json({
                message: `provided Category doesn't exists. Please choose a valid category.`,
            });
        }
        //if image is uploaded then stores it's path otherwise null
        const productData = { name, brand, description, price, stock, category_id, ...(image_url && { image_url }) };
        const product = await Product.create(productData);
        return res.status(201).json({ product: product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while creating the product." });
    }
}

//PATCH product controller function
async function updateProduct(req, res) {
    try {
        const id = req.params.id;

        const product = await Product.findOne({ where: { id } });
        if (!product) {
            return res.status(404).json({ message: `Product doesn't exists. Please choose a valid product.` });
        }

        const { name, brand, description, price, stock, category_id } = req?.body;
        const image_url = req.file ? `/uploads/image/${req.file.filename}` : null;

        if (!name && !brand && !description && !price && !stock && !category_id && !image_url) {
            return res.status(400).json({ message: `Atleast one of the [ name, brand, description, price, stock, category_id, image_url ] param is required to update.` });
        }
        if (category_id) {
            const validCategory = await Category.findOne({ where: { id: category_id } });
            if (!validCategory) {
                // If error occurs and updation fail, it still stores the image so this will Delete the uploaded image if the update fails
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
        }
        //stores old image path for future deletion if user updates the prouct image
        const oldImagePath = product.image_url ? path.join(__dirname, '..', '..', '..', product.image_url) : null;

        const updateData = {
            ...(name) && { name: name },
            ...(brand) && { brand: brand },
            ...(description) && { description: description },
            ...(price) && { price: price },
            ...(stock) && { stock: stock },
            ...(category_id) && { category_id: category_id },
            ...(image_url) && { image_url: image_url },
        };
        const [affectedRows] = await Product.update(updateData, { where: { id } });
        console.log(affectedRows);
        if (affectedRows > 0) {
            if (image_url && oldImagePath && oldImagePath !== path.join(__dirname, '..', '..', '..', image_url)) {
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
        console.error(error);
        return res.status(500).json({ message: "An error occurred while updating the product." });
    }
}

//DELETE product controller function
async function deleteProduct(req, res) {
    try {
        const id = req.params.id;
        const product = await Product.findOne({ where: { id } });
        if (!product) {
            return res.status(404).json({ message: `No product found with id: ${id}.` })
        }
        //Product image that is to be deleted
        if (product.image_url) {
            const imagePath = path.join(__dirname, '..', '..', '..', product.image_url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        const deletedProduct = await Product.destroy({ where: { id } });
        return res.status(200).json({ message: "User deleted Successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred while deleting the product.", error: error });

    }
}

module.exports = { getProducts, getProductById, getProductByCategory, createProduct, updateProduct, deleteProduct }