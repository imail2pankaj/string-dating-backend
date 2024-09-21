const httpStatus = require('http-status');
const AppError = require('../utils/ApiError');
const config = require('../config/cfg');
const { findUserByEmail, saveUser, comparePassword, findUsers, findUser } = require('../services/user.service');
const { generateAuthTokens } = require('../services/token.service');
const ApiError = require('../utils/ApiError');
const { Op, where } = require('sequelize');
const { saveChannel, findChannel, saveChannelMember } = require('../services/channel.service');
const { Channel, ChannelMember, Message, User, sequelize } = require('../models');

const getChannels = async (req, res) => {

  try {
    let channels = await Channel.findAll({
      where: {
        type: "PUBLIC"
      },
      include: [
        {
          model: Message,
          include: [
            { model: User, as: "user" }
          ]
        }]
    });

    return res
      .status(httpStatus.OK)
      .json(channels);
  } catch (error) {
    console.log(error)
  }

}
const joinChannel = async (req, res) => {

  const { user_id, type, channel : channelName } = req.body;

  try {
    if (type === 'PUBLIC') {
      let chnl = await Channel.findOne({
        where: {
          type: "PUBLIC",
          name: channelName
        },
        include: [
          {
            model: Message,
            include: [
              { model: User, as: "user" }
            ]
          }]
      });

      return res
        .status(httpStatus.OK)
        .json(chnl);
    }

    const user = await findUser({ id: user_id });

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    let channel = await Channel.findOne({
      where: {
        name: {
          [Op.in]: [`${user.username}_${req.user.username}`, `${req.user.username}_${user.username}`]
        },
        type
      },
      include: [
        {
          model: Message,
          include: [
            { model: User, as: "user" }
          ]
        }]
    });

    if (channel) {
      return res
        .status(httpStatus.OK)
        .json(channel);
    }

    channel = await saveChannel({ name: `${user.username}_${req.user.username}`, type });
    saveChannelMember({
      invitation_status: false,
      channel_id: channel.id,
      user_id: user.id,
    })
    saveChannelMember({
      invitation_status: false,
      channel_id: channel.id,
      user_id: req.user.id,
    })

    return res
      .status(httpStatus.OK)
      .json(channel);

  } catch (error) {
    console.log(error)
    return res
      .status(error.statusCode)
      .json({ message: error.message });

  }

}

module.exports = {
  joinChannel,
  getChannels
}