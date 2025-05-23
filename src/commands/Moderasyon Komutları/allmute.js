const {PermissionFlagsBits} = require("discord.js");
const config = require("../../../config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "allmute",
    usage:"allmute / allmute aç",
    category:"moderasyon",
    aliases: ["herkesi-sustur", "ksus","kanal-sustur","kanalısustur"],
    execute: async (client, message, args, parsher_embed) => {
        let staffData = await db.get("five-ban-staff") || [];
        if(!staffData.length > 0)console.error("Ban Yetkilisi Ayarlı Değil!");
        if(!staffData.some(parsher => message.member.roles.cache.get(parsher)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers))return message.reply({ embeds: [parsher_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);
        
        if (!message.member.voice.channel) return message.reply({ embeds: [parsher_embed.setDescription(`> **Bir Ses Kanalında Değilsin!**`)] }).sil(5);
        let member = message.member.voice.channel.members.array();
        for (let i = 0; i < member.length; i++) {
            const user = member[i];
            if (user.id != message.author.id) {
                args[0] == "aç" ? user.voice.setMute(false).catch((err) => { }) : user.voice.setMute(true).catch((err) => { });
            }
        }
        client.true(message)
        return message.reply({ embeds: [parsher_embed.setDescription(`> **İşlem Başarılı!**`)] }).sil(7);
    }
}