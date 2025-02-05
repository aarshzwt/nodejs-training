module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            default: 0
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'categories',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        image_url: {
            type: DataTypes.STRING(500),
        },
    }, {
        timestamps: true,  // Adds createdAt and updatedAt automatically
        tableName: 'products',
    });


    Product.associate = (models) => {
        // Product belongs to a Category (one-to-one)
        Product.belongsTo(models.Category, {
            foreignKey: 'category_id',
            onDelete: 'CASCADE',
        });
    };

    return Product;
};
