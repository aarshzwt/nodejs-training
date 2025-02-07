module.exports = (sequelize, DataTypes) => {
    const Wishlist = sequelize.define('Wishlist', {
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
    }, {
        timestamps: true,  // Adds createdAt and updatedAt automatically
        tableName: 'wishlist',
        defaultScope: {
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        },
    });


    Wishlist.associate = (models) => {
        // Wishlist belongs to a Product (one-to-one)
        Wishlist.belongsTo(models.Product, {
            foreignKey: 'product_id',
            onDelete: 'CASCADE',
        });
        // Wishlist belongs to a User (one-to-one)
        Wishlist.belongsTo(models.User, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
        });

    };

    return Wishlist;
};
