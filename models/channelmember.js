'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChannelMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ChannelMember.belongsTo(models.Channel, { foreignKey: 'channel_id' });
    }
  }
  ChannelMember.init({
    user_id: DataTypes.INTEGER,
    channel_id: DataTypes.INTEGER,
    invitation_status: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'channel_members',
    modelName: 'ChannelMember',
  });
  return ChannelMember;
};