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
module.exports = {
    name: "görevler",
    usage: "görevler",
    category: "stat",
    aliases: ["tasks", "görevlerim", "görevlers"],
    execute: async (client, message, args, parsher_embed) => {

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        if(!config.staffs.some(pars => message.member.roles.cache.has(pars)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers))return message.reply({embeds:[parsher_embed.setDescription(`> **Yeterli Yetki Bulunmamakta!**`)]}).sil(5);
        if(!config.staffs.some(pars => member.roles.cache.has(pars)))return message.reply({embeds:[parsher_embed.setDescription(`> **Yeterli Yetkisi Bulunmamakta!**`)]}).sil(5);


       const tasks = await task.find({ guildId: message.guild.id, userId: member.id });
       //if(tasks.length == 0)return message.reply({embeds:[parsher_embed.setDescription(`> **Datada Hiç Görev Bulunmamakta!**`)]}).sil(5);


        parsher_embed.setTitle(`Yetkili Görev Sistemi`).setURL(`https://linktr.ee/beykant`).setThumbnail(member.user.displayAvatarURL({ dynamic: true }));

        message.reply({
            embeds: [
                parsher_embed.setDescription(`> **${member.user.toString()} Kullanıcısının Görev Bilgileri;**\n\n> **Toplam Görev; ${client.sayıEmoji(tasks.length)} Adet**\n> **Tamamlanmış Görev; ${client.sayıEmoji(tasks.filter((x) => x.completed).length)} Adet**\n> **Tamamlanmamış Görev; ${client.sayıEmoji(tasks.filter((x) => !x.completed).length)} Adet**\n> **Aktif Görev; ${client.sayıEmoji(tasks.filter((x) => x.active).length)} Adet**\n\n${tasks
                    .filter((x) => x.active)
                    .map(
                        (x) =>
                            `\`#${x.id}\` ${x.message} \n${x.completedCount >= x.count
                                ? conf.emojis.coin + " **Tamamlandı!**"
                                : `> ${client.progressBar(x.completedCount, x.count, 7)} \`${x.type === "ses"
                                    ? `${moment.duration(x.completedCount).format("H [Saat], m [Dk], s [Sn]")} / ${moment.duration(x.count).format("H [Saat], m [Dk], s [Sn]")}`
                                    : `${x.completedCount} / ${x.count}`
                                }\` \n> **Kalan Süre: \`${x.finishDate - Date.now() > 0 ? moment.duration(x.finishDate - Date.now()).format("H [Saat], m [Dakika] s [Saniye]") : "Süresiz (Sınırsız)"}\`**\n> **Ödül:  \`${x.prizeCount} Puan\`**`
                            }`
                    )
                    .join("\n\n")}
                   `)
            ]
        });



    }
}
