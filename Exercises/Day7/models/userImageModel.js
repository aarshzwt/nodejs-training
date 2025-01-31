module.exports = (sequelize, DataTypes) => {
    const UserImage = sequelize.define('UserImage', {
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
        references: {
          model: 'users', 
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      imageName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mimeType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      extension: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      size: {
        type: DataTypes.BIGINT,
        allowNull: false,
      }
    }, {
      timestamps: true,  // Adds createdAt and updatedAt automatically
      tableName: 'user_images',

    });
  
    UserImage.associate = (models) => {
      // UserImages belongs to a User (one-to-many)
      UserImage.belongsTo(models.User, { 
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
    };
  
    return UserImage;
  };
  