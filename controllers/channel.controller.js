const httpStatus = require('http-status');
const AppError = require('../utils/ApiError');
const config = require('../config/cfg');
const { findUserByEmail, saveUser, comparePassword, findUsers, findUser } = require('../services/user.service');
const { generateAuthTokens } = require('../services/token.service');
const ApiError = require('../utils/ApiError');
const { Op, where } = require('sequelize');
const { saveChannel, findChannel, saveChannelMember } = require('../services/channel.service');
const { Channel, ChannelMember, Message, User } = require('../models');

const joinChannel = async (req, res) => {
  const { user_id, type } = req.body;

  try {

    const user = await findUser({ id: user_id });

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    let channel = await Channel.findOne({
      where: { type },
      include: [{
        model: ChannelMember,
        where: {
          user_id: {
            [Op.in]: [user_id, req.user.id]
          }
        },
        required: true
      }, {
        model: Message,
        include: [
          { model: User, as: "user" }
        ]
      }]
    });

    if (!channel && channel.ChannelMembers.length !== 2) {
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
    }

    return res
      .status(httpStatus.OK)
      .json(channel);

  } catch (error) {
    console.log(error);
    return res
      .status(error.statusCode)
      .json({ message: error.message });

  }

}

module.exports = {
  joinChannel,
}