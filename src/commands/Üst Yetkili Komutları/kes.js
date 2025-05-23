const { PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const config = require("../../../config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "kes",
    usage: "kes",
    category:"üstyt",
    aliases: ["bağlantı-kes","kanaldanat","kess"],
    execute: async (client, message, args, parsher_embed) => {
        let staffData = await db.get("five-ban-staff") || [];
        if (!staffData.length > 0) console.error("Ban Yetkilisi Ayarlı Değil!");
        if (!staffData.some(parsher => message.member.roles.cache.get(parsher)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers)) return message.reply({ embeds: [parsher_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) return message.reply({ embeds: [parsher_embed.setDescription(`> **Geçerli Bir User Belirt!**`)] }).sil(5);
        if (!user.voice.channel) return message.reply({ embeds: [parsher_embed.setDescription(`> **Geçerli Ses Kanalında Bulunan Bir User Belirt!**`)] }).sil(5);
        if(user.roles.highest.position >= message.member.roles.highest.position) return message.reply({ embeds: [parsher_embed.setDescription(`> **Kendinden Üst/Aynı Pozisyondaki Birine İşlem Uygulayamazsın!**`)]}).sil(5);
        if(user.user.bot) return message.reply({ embeds: [parsher_embed.setDescription(`> **Bir Bot'a İşlem Uygulayamazsın!**`)]}).sil(5);
        await user.voice.disconnect()
        client.true(message);
        user.send({content:`> **\`${message.author.tag}\` Tarafından ${message.guild.name} Sunucusundaki Ses Bağlantın Kesildi!**`}).catch(err => { })
    }
}