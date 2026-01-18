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
{
  indexes: [
    { fields: ['userId'] },
    { fields: ['imageId'] },
    { unique: true, fields: ['userId', 'id'] } // مثال: فهرس فريد مركب لجدول Votes
  ]
};
Captions.associate = (models) => {
    // الصورة تتبع المستخدم الذي أضاف الكابشن
    Captions.belongsTo(models.Users, {
      foreignKey: "userId",
      as: "captionByUser",
      onDelete: 'CASCADE' 
    });
    Captions.belongsTo(models.Images, {
      foreignKey: "imageId",
      as: "image_Id",
      onDelete: 'CASCADE' 
    });
  ;
  };
  return Captions ; 
}