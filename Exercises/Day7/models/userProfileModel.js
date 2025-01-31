module.exports = (sequelize, DataTypes) => {
    const UserProfile = sequelize.define('UserProfile', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        bio: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        linkedInUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        facebookUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        instaUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps: true,  // Adds createdAt and updatedAt automatically
        tableName: 'user_profiles',

    });

    UserProfile.associate = (models) => {
        // UserProfile belongs to a User (one-to-one)
        UserProfile.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
        });
    };

    return UserProfile;
}

