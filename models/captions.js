const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');
module.exports = (sequelize, DataTypes) => {
const Captions = sequelize.define(
  'Captions',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
    
      autoIncrement:true,
      primaryKey:true
    },
    text: { 
      type: DataTypes.STRING
    },
    imageId: { 
      
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    userId:{
        type: DataTypes.INTEGER,
       allowNull: true, 
    },
     createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
  }
  
);
Captions.associate = (models) => {
    // الصورة تتبع المستخدم الذي أضاف الكابشن
    Captions.belongsTo(models.Users, {
      foreignKey: "userId",
      as: "captionByUser",
    });
    Captions.belongsTo(models.Images, {
      foreignKey: "imageId",
      as: "image_Id",
    });
  ;
  };
  return Captions ; 
}