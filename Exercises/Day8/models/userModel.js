const bcrypt = require('bcrypt')

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
        first_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('admin', 'customer'),
            allowNull: false,
            default: "customer",
        },
       
    }, {
        timestamps: true,  // Adds createdAt and updatedAt automatically
        tableName: 'users',
        hooks: {
            beforeCreate: async (user, options) => {
                if (user.password) {
                    user.password = await bcrypt.hash(user.password, 13);
                }
            },
            beforeUpdate: async (user, options) => {
                if (user.changed('password')) {
                    user.password = await bcrypt.hash(user.password, 13);
                }
            }
        }
    });

    // Custom instance method for password comparison
    User.prototype.comparePassword = async function (password) {
        return bcrypt.compare(password, this.password);
    };
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
