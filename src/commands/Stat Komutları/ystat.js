const { PermissionFlagsBits, ButtonStyle, ButtonBuilder, ActionRowBuilder, Events, EmbedBuilder, StringSelectMenuBuilder, ComponentType, codeBlock, Embed } = require("discord.js");
const config = require("../../../config")
const client = global.client;
const db = client.db;
const ms = require("ms")
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
module.exports = {
    name: "ystat",
    usage: "ystat [@parsher / ID]",
    category: "stat",
    aliases: ["yetkili-stat", "yetkilistat", "yetkistat", "yetkiyükseltim", "ytstat"],
    execute: async (client, message, args, parsher_embed) => {
        if(!config.staffs.some(pars => message.member.roles.cache.has(pars)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers))return message.reply({embeds:[parsher_embed.setDescription(`> **Yeterli Yetki Bulunmamakta!**`)]}).sil(5);

        let member = message.mentions.members.first() || message.guild.members.cache.get([args[0]]) || message.member;

        const pointData = await point.findOne({ guildId: message.guild.id, userId: member.user.id });
        if(!pointData)return message.reply({embeds:[parsher_embed.setDescription(`> **Puan Bulunmamakta!**`)]}).sil(5);
		const maxValue = client.ranks[client.ranks.indexOf(client.ranks.find((x) => x.point >= (pointData ? Math.floor(pointData.point) : 0)))] || client.ranks[client.ranks.length - 1];
		const currentRank = client.ranks.filter((x) => (pointData ? Math.floor(pointData.point) : 0) >= x.point).last();

		if (config.taskSystem && member.hasRole(config.staffs, false) && client.ranks.length > 0) {
			parsher_embed.addFields([{name:`**${client.emoji("emote_value") !== null ? client.emoji("emote_value"):"🔹"} Puan Durumu:**`, value:`\n${client.progressBar(pointData ? Math.floor(pointData.point) : 0, maxValue.point, 8)} \`${pointData ? Math.floor(pointData.point) : 0} / ${maxValue.point}\``}]);
			parsher_embed.addFields([{name:
				`**${client.emoji("emote_value") !== null ? client.emoji("emote_value"):"🔹"} Yetki Durumu:**`,value:
				currentRank !== client.ranks.last()
					? `${currentRank ? `**Şuan ${Array.isArray(currentRank.role) ? currentRank.role.listRoles() : `<@&${currentRank.role}>`} Yetkisindesiniz.**` : ""} ${
							Array.isArray(maxValue.role) ? maxValue.role.listRoles() : `<@&${maxValue.role}>`
					  } **Yetkisine Ulaşmak İçin \`${Math.floor(maxValue.point - Math.floor(pointData.point))}\` Puan Daha Kazanmanız Gerekiyor!**`
					: "**Son Yetkidesiniz!**"
                    }]);
		}
		parsher_embed.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 2048 }));
		parsher_embed.setDescription(`> **${member.user.toString()} (${member.roles.highest.toString()}) **`);
		message.reply({ embeds: [parsher_embed] });

    }
}
