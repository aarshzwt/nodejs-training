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
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
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
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    }, {
        timestamps: true,  // Adds createdAt and updatedAt automatically
        tableName: 'users',
        hooks: {
            // Hash password before creating a user
            beforeCreate: async (user, options) => {
                if (user.password) {
                    user.password = await bcrypt.hash(user.password, 13);
                }
            },
            // Hash password before updating a user (if password field is updated)
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
