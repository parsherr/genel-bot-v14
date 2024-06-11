const joinedAt = require("../schemas/voicesJoinSchema");
const voiceUser = require("../schemas/voicesSchema");
const voiceGuild = require("../schemas/voiceGuildSchema");
const guildChannel = require("../schemas/voiceGuildChannelsSchema");
const userChannel = require("../schemas/voiceChannelsSchema");
const userParent = require("../schemas/voiceParentsSchema");
const point = require("../schemas/staffsSchema");
const client = global.client;
const config = require("../../config");
const { Events } = require("discord.js");

module.exports = async (oldState, newState) => {
 if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;

let pars = oldState ? oldState : newState;
  if (!oldState.channel  && newState.channel) await joinedAt.findOneAndUpdate({ userId: newState.id }, { $set: { Data: Date.now() } }, { upsert: true });
  let joinedAtData = await joinedAt.findOne({ userId: oldState.id });
  if (!joinedAtData) await joinedAt.findOneAndUpdate({ userId: oldState.id }, { $set: { Data: Date.now() } }, { upsert: true });
  joinedAtData = await joinedAt.findOne({ userId: oldState.id });
  const data = Date.now() - joinedAtData.Data;
  if (oldState.channel  && !newState.channel) {
    await saveData(oldState, oldState.channel, data);
    await joinedAt.deleteOne({ userId: oldState.id });
  } else if (oldState.channel && newState.channel) {
    await saveData(oldState ? oldState : newState, oldState.channel, data);
    await joinedAt.findOneAndUpdate({ userId: newState.id }, { $set: { Data: Date.now() } }, { upsert: true });
  }
};

async function saveData(user, channel, data) {
if (config.taskSystem && config.staffs.some((pars) => user.member.roles.cache.has(pars))) {
		if (channel.parent && config.parents.publicParents.includes(channel.parentId)){
		await point.updateOne({ guildId: user.guild.id, userId: user.id },{$inc: {point: (data / 1000 / 60 / 1) * 8}},{ upsert: true });
        }else{
        await point.updateOne({ guildId: user.guild.id, userId: user.id },{$inc: {point: (data / 1000 / 60 / 1) * 2}},{ upsert: true });
        }
		const pointData = await point.findOne({guildId: user.guild.id,userId: user.id});
		if (pointData && client.ranks.some((pars) => pars.point >= pointData.point)) {
		const newRank = client.ranks.filter((pars) => pointData.point >= pars.point).last();
		if ((newRank && Array.isArray(newRank.role) && !newRank.role.some((x) => user.member.roles.cache.has(x))) ||(newRank && !Array.isArray(newRank.role) && !user.member.roles.cache.has(newRank.role))) {
		user.member.roles.add(newRank.role);
		const oldRoles = client.ranks.filter((pars) => pointData.point < pars.point && user.member.hasRole(pars.role));
		oldRoles.forEach((pars) => pars.role.forEach((five) => user.member.roles.remove(five)));
			}
		}
	}
	user.member.updateTask(user.guild.id, "ses", data, channel);	
    await voiceUser.updateOne({ guildId: user.guild.id, userId: user.id },{$inc: {topStat: data,dailyStat: data,weeklyStat: data}},{ upsert: true });
	await voiceGuild.updateOne({ guildId: user.guild.id },{$inc: {topStat: data,dailyStat: data,weeklyStat: data}},{ upsert: true });
	await guildChannel.updateOne({ guildId: user.guild.id, channelId: channel.id }, { $inc: { channelData: data } }, { upsert: true });
	await userChannel.updateOne({ guildId: user.guild.id, userId: user.id, channelId: channel.id }, { $inc: { channelData: data } }, { upsert: true });
	if(channel.parent)await userParent.updateOne({guildId: user.guild.id,userId: user.id,parentId: channel.parentId},{ $inc: { parentData: data } },{upsert: true });
}
module.exports.conf = {name:Events.VoiceStateUpdate};
