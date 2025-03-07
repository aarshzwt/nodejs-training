module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true,

        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        razorpay_order_id: {
            type: DataTypes.STRING(45),
            unique: true,
        },
       total_price: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
            
        },
        status: {
            type: DataTypes.ENUM('pending', 'shipped', 'delivered', 'canceled'),
            default:'pending',
        },
    }, {
        timestamps: true,  // Adds createdAt and updatedAt automatically
        tableName: 'orders',
       
    });


    Order.associate = (models) => {
        // Order belongs to User (one-to-many)
        Order.belongsTo(models.User, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
        });

        Order.hasMany(models.OrderItem, {
            foreignKey: 'order_id',
            onDelete: 'CASCADE',
        });

    };

    return Order;
};
