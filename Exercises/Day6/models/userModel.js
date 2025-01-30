// userModel.js
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        timestamps: true,  // Adds createdAt and updatedAt automatically
        tableName: 'users',
    });

    User.associate = (models) => {
        // User has one UserProfile (one-to-one)
        User.hasOne(models.UserProfile, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
        });

        // User has many UserImages (one-to-many)
        User.hasMany(models.UserImage, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
        });
    };

    return User;
};
