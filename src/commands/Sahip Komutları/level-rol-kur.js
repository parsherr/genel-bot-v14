const { PermissionFlagsBits, ButtonStyle, ButtonBuilder, ActionRowBuilder, Events, EmbedBuilder } = require("discord.js");
const config = require("../../../config")
const client = global.client;
const canvafy = require('canvafy');
const db = client.db;
module.exports = {
    name: "level-rol-kur",
    usage: "level-rol-kur",
    category:"sahip",
    aliases: ["lvlrolkur", "lvlrol"],
    execute: async (client, message, args, parsher_embed) => {
        let staffData = await db.get("five-ban-staff") || [];
        if (!staffData.length > 0) console.error("Ban Yetkilisi Ayarlı Değil!");
        if (!staffData.some(parsher => message.member.roles.cache.get(parsher)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers)) return message.reply({ embeds: [parsher_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);
        client.true(message)
        message.reply({ content: `> **📝 Level Rolleri Kuruluyor..**`})
        const burc = config.levelRoles;
        for (let index = 0; index < burc.length; index++) {
        let element = burc[index];
        await message.guild.roles.create({name: element.name,color: element.color,})
        }
     message.reply({ content: `> **✅ Level Rollerinin Kurulumu Tamamlandı!**` })

    }
}
