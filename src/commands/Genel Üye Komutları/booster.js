const { PermissionFlagsBits, ButtonStyle, ButtonBuilder, ActionRowBuilder, Events, EmbedBuilder } = require("discord.js");
const config = require("../../../config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "booster",
    usage: "booster <İsim>",
    category:"genel",
    aliases: ["zengin", "boost", "boosts"],
    execute: async (client, message, args, parsher_embed) => {
        if(!message.member.roles.cache.get(message.guild.roles.premiumSubscriberRole ? message.guild.roles.premiumSubscriberRole.id : "5"))return message.reply({ embeds: [parsher_embed.setDescription(`> **Bu Komut Sadece ${message.guild.roles.premiumSubscriberRole ? `<@&${message.guild.roles.premiumSubscriberRole.id}>` : "Booster"} Rolüne Özel!**`)] }).sil(5);
        let name = args.slice(0).join(' ');;
        if(!name) return message.reply({ embeds: [parsher_embed.setDescription(`> **Lütfen Yeni Bir Sunucu İsmi Belirt!**`)] }).sil(5);
        if(name.length >= 24) return message.reply({ embeds: [parsher_embed.setDescription(`> **Lütfen 24 Karakterden Az Bir İsim Belirt!**`)] }).sil(5);
        message.member.setNickname(`${config.tagSymbol} ${name}`).catch((err) => { })
        client.true(message);
        return message.reply({ embeds: [parsher_embed.setDescription(`> **Adın Başarıyla \`${config.tagSymbol} ${name}\` Olarak Değiştirildi!**`).setColor("Random")] }).sil(15);
    }
}
