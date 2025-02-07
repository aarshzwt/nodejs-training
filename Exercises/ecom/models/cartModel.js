module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define('Cart', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'products',
                key: 'id',
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            default: 1,
        },
    }, {
        timestamps: true,  // Adds createdAt and updatedAt automatically
        tableName: 'cart',
        defaultScope: {
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        },
    });


    Cart.associate = (models) => {
        // Cart belongs to a User (one-to-one)
        Cart.belongsTo(models.User, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
        });
        // Cart belongs to a Product (one-to-many)
        Cart.belongsTo(models.Product, {
            foreignKey: 'product_id',
            onDelete: 'CASCADE',
        });
    };

    return Cart;
};
