const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');
module.exports = (sequelize, DataTypes) => {
const Votes = sequelize.define(
  'Votes',
  {
    // Model attributes are defined here
    vote_id: {
      type: DataTypes.INTEGER,
    
      autoIncrement:true,
      primaryKey:true
    },
    captionId: { 
      type: DataTypes.INTEGER
    },
    userId:{
      type: DataTypes.INTEGER

    },
     createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
  }
  
);
Votes.associate = (models) => {
    // الصورة تتبع المستخدم الذي أضاف الكابشن
    Votes.belongsTo(models.Users, {
      foreignKey: "userId",
      as: "captionByUser",
    });
      Votes.belongsTo(models.Users, {
      foreignKey: "captionId",
      as: "caption",
    });
  };
  return Votes ; 
}