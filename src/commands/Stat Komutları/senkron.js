const { PermissionFlagsBits, ButtonStyle, ButtonBuilder, ActionRowBuilder, Events, EmbedBuilder, StringSelectMenuBuilder, ComponentType, codeBlock, Embed } = require("discord.js");
const config = require("../../../config")
const client = global.client;
const db = client.db;
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr");
const canvafy = require("canvafy");
const messageGuild = require("../../schemas/messageGuildSchema");
const messageGuildChannel = require("../../schemas/messageGuildChannelsSchema");
const voiceGuild = require("../../schemas/voiceGuildSchema");
const voiceGuildChannel = require("../../schemas/voiceGuildChannelsSchema");
const messageUser = require("../../schemas/messagesSchema");
const voiceUser = require("../../schemas/voicesSchema");
const point = require("../../schemas/staffsSchema");
const invite = require("../../schemas/invitesSchema");
const task = require("../../schemas/tasksSchema");
const taggeds = require("../../schemas/taggedsSchema")
module.exports = {
    name: "senkron",
    usage: "senkron [@parsher / ID",
    category: "stat",
    aliases: ["senkron","senkronize"],
    execute: async (client, message, args, parsher_embed) => {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!config.staffs.some(pars => message.member.roles.cache.has(pars)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers))return message.reply({embeds:[parsher_embed.setDescription(`> **Yeterli Yetki Bulunmamakta!**`)]}).sil(5);
        if(!member)return message.reply({embeds:[parsher_embed.setDescription(`> **Geçerli Bir User Belirt!**`)]}).sil(5);
	if (client.ranks.some((x) => member.hasRole(x.role))) {
				let rank = client.ranks.filter((x) => member.hasRole(x.role));
				rank = rank[rank.length - 1];
				await point.updateOne({ guildId: message.guild.id, userId: member.user.id }, { $set: { point: rank.point } }, { upsert: true });
				message.reply({
					embeds: [
						parsher_embed.setDescription(
							`> **${member.toString()} Üyesinde ${Array.isArray(rank.role) ? rank.role.map((x) => `<@&${x}>`).join(", ") : `<@&${rank.role}>`} Rolü Bulundu Ve Soul'u ${rank.point} Olarak Değiştirildi!**`
						)
					]
				});
			} else return message.reply({ embeds: [parsher_embed.setDescription(`> **${member.toString()} Üyesinde Sistemde Ayarlı Bir Rol Bulunamadı!**`)] });
    }
}
