module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,

        },
        image_url: {
            type: DataTypes.STRING(500),
        },
    }, {
        timestamps: true,  // Adds createdAt and updatedAt automatically
        tableName: 'categories',
        defaultScope: {
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        },
    });


    Category.associate = (models) => {
       // Category has Many Product (one-to-many)
       Category.hasMany(models.Product, {
        foreignKey: 'category_id',
        onDelete: 'CASCADE',
    });
    };

    return Category;
};
