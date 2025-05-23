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
    name: "rank",
    usage: "rank [+/-/temizle/list] [Puan] [@Roller]",
    category: "stat",
    aliases: ["ranks", "ytsistemi"],
    execute: async (client, message, args, parsher_embed) => {
    if(!message.member.permissions.has(PermissionFlagsBits.Administrator))return message.reply({embeds:[parsher_embed.setDescription(`> **Yeterli Yetki Bulunmamakta!**`)]}).sil(5);

    const point = args[1];
    if(!args[0])return message.reply({ embeds: [parsher_embed.setDescription("> **Bir Argüman Gir**")] }).sil(5);
            if (args[0] === "+") {
                if (!point || isNaN(point)) return message.reply({ embeds: [parsher_embed.setDescription("> **Eklenecek Yetkinin Puanını Belirtmelisin!**")] }).sil(5);
                if (client.ranks.some((x) => x.point === point)) return message.reply({ embeds: [parsher_embed.setDescription(`> **${point} Puana'a Ulaşıldığında Verilecek Roller Zaten Ayarlı!**`)] }).sil(5);
                const roles = [...message.mentions.roles.values()];
                if (!roles || !roles.length) return message.reply({ embeds: [parsher_embed.setDescription("> **Eklenecek Yetkinin rollerini Belirtmelisin!**")] }).sil(5);
                client.rdb.push("ranks", { role: roles.map((x) => x.id), point: parseInt(point) }).sort((a, b) => a.point - b.point);
                return message.reply({ embeds: [parsher_embed.setDescription(`> **${point} Puan'a Ulaşıldığında Verilecek Roller:**\n${roles.map((x) => `<@&${x.id}>`).join(", ")}`)] }).sil(5);
            } else if (args[0] === "-") {
                if (!point || isNaN(point)) return message.reply({ embeds: [parsher_embed.setDescription("> **Silinecek Yetkinin Puanı'nı Belirtmelisin!**")] }).sil(5);
                if (!client.ranks.some((x) => x.point == point)) return message.reply({ embeds: [parsher_embed.setDescription(`> **${point} Puan'a Ulaşıldığında Verilecek Roller Zaten Ayarlanmamışki!**`)] }).sil(5);
                client.rdb.set("ranks",client.ranks.filter((x) => x.point !== point) ).sort((a, b) => a.point - b.point);
                message.reply({ embeds: [parsher_embed.setDescription(`> **${point} Puan'a Ulaşıldığında Verilecek Roller Silindi!**`)] }).sil(5);
            } else if (args[0] === "temizle") {
                if (!client.rdb.get("ranks") || !client.rdb.get("ranks").length) return message.reply({ embeds: [parsher_embed.setDescription("> **Yetki Yükseltim Sistemi Bomboş!**")] }).sil(5);
                client.rdb.set("ranks", []);
                message.reply({ embeds: [parsher_embed.setDescription("> **Tüm Yetkiler Başarıyla Temizlendi!**")] }).sil(5);
            } else if (args[0] === "list") {
                const ranks = client.rdb.get("ranks");
                message.reply({
                    embeds: [
                        parsher_embed.setDescription(
                            ranks && ranks.length
                                ? ranks
                                        .sort((a, b) => b.point - a.point)
                                        .map((x) => `${Array.isArray(x.role) ? x.role.listRoles() : `<@&${x.role}>`} **[${x.point} Puan]**`)
                                        .join("\n")
                                : "> **Rank Ayarlanmamış!**"
                        )
                    ]
                });
            }


    }
}
