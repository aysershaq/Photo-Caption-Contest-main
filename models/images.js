const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');
module.exports = (sequelize, DataTypes) => {
const Images = sequelize.define(
  'Images',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
    
      autoIncrement:true,
      primaryKey:true
    },
    caption: { 
      type: DataTypes.STRING
    },
    imageUrl: { 
      
      type: DataTypes.STRING, 
      allowNull: false 
    },
    captionByUserId:{
        type: DataTypes.INTEGER,
       allowNull: true, 
    }
    
  }
  
);
Images.associate = (models) => {
    // الصورة تتبع المستخدم الذي أضاف الكابشن
    Images.belongsTo(models.Users, {
      foreignKey: "captionByUserId",
      as: "captionByUser",
    });
  };
  return Images ; 
}