module.exports = (sequelize, DataTypes) => {
    const TemporaryOrder = sequelize.define('TemporaryOrder', {
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
        razorpay_order_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        total_price: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,   
        },
    });

    return TemporaryOrder;
};
