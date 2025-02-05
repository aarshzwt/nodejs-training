module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('OrderItem', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            autoIncrement: true,
            primaryKey: true,
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'orders',
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
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    }, {
        timestamps: true,  // Adds createdAt and updatedAt automatically
        tableName: 'order_items',
    });


    OrderItem.associate = (models) => {
        // OrderItem belongs to a Product (one-to-one)
        OrderItem.belongsTo(models.Product, {
            foreignKey: 'product_id',
            onDelete: 'CASCADE',
        });
        // OrderItem belongs to a Order (one-to-one)
        OrderItem.belongsTo(models.Order, {
            foreignKey: 'order_id',
            onDelete: 'CASCADE',
        });

    };

    return OrderItem;
};
