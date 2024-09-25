'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Channel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.ChannelMember, { foreignKey: 'channel_id' });
      this.hasMany(models.Message, { foreignKey: 'channel_id' });
    }
  }
  Channel.init({
    name: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Channel',
    tableName: "channels"
  });
  return Channel;
};