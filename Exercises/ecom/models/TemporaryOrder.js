module.exports = (sequelize, DataTypes) => {
    const TemporaryOrder = sequelize.define('TemporaryOrder', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        razorpay_order_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return TemporaryOrder;
};
