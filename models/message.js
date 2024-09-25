'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Message.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      Message.belongsTo(models.Channel, { foreignKey: 'channel_id', as: 'channel' });
    }
  }
  Message.init({
    message: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    channel_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Message',
    tableName: "messages"
  });
  return Message;
};