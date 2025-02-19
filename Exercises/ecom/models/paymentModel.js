module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
        razorpay_payment_id: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        razorpay_order_id: {
            type: DataTypes.STRING(45),
            allowNull: false,
            references: {
                model: 'orders',
                key: 'razorpay_order_id',
            },
        },
        
    }, {
        timestamps: true,  // Adds createdAt and updatedAt automatically
        tableName: 'payments',
       
    });


    Payment.associate = (models) => {
        // Payment belongs to Order (one-to-many)
        Payment.belongsTo(models.Order, {
            foreignKey: 'razorpay_order_id',
            onDelete: 'CASCADE',
        });

    };

    return Payment;
};
