module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
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
       total_price: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
            
        },
        status: {
            type: DataTypes.ENUM('pending', 'shipped', 'delivered', 'canceled'),
            allowNull: false,
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

    };

    return Order;
};
