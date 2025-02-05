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
    }, {
        timestamps: true,  // Adds createdAt and updatedAt automatically
        tableName: 'categories',
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
