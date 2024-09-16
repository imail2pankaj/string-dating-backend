const bcrypt = require('bcrypt');

const { Channel, ChannelMember } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { generateUsername } = require('../utils/functions');

const findChannel = async (where) => {
  const channel = await Channel.findOne({ where: where });

  return channel;
}

const saveChannel = async ({ type, name }) => {

  try {

    const channel = await Channel.create({
      name,
      type
    })

    return channel;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message)
  }
}

const saveChannelMember = async ({ user_id, channel_id, invitation_status }) => {

  try {

    const channelMember = await ChannelMember.create({
      user_id, channel_id, invitation_status
    })

    return channelMember;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message)
  }
}


module.exports = {
  saveChannel,
  findChannel,
  saveChannelMember
}