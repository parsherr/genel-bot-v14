const { PermissionFlagsBits, ButtonStyle, ButtonBuilder, ActionRowBuilder, Events } = require("discord.js");
const config = require("../../../config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "sil",
    usage: "sil <0-100>",
    category:"moderasyon",
    aliases: ["delete", "kaldır", "temizle", "sils"],
    execute: async (client, message, args, parsher_embed) => {
        let staffData = await db.get("five-ban-staff") || [];
        if (!staffData.length > 0) console.error("Ban Yetkilisi Ayarlı Değil!");
        if (!staffData.some(parsher => message.member.roles.cache.get(parsher)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers)) return message.reply({ embeds: [parsher_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);

        let buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("10")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji(`${client.emoji("emote_value") !== null ? client.emoji("emote_value") : "🗑️"}`)
                    .setCustomId(`${message.author.id}_delete_10`),
                new ButtonBuilder()
                    .setLabel("25")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji(`${client.emoji("emote_value") !== null ? client.emoji("emote_value") : "🗑️"}`)
                    .setCustomId(`${message.author.id}_delete_25`),
                new ButtonBuilder()
                    .setLabel("50")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji(`${client.emoji("emote_value") !== null ? client.emoji("emote_value") : "🗑️"}`)
                    .setCustomId(`${message.author.id}_delete_50`),
                new ButtonBuilder()
                    .setLabel("100")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji(`${client.emoji("emote_value") !== null ? client.emoji("emote_value") : "🗑️"}`)
                    .setCustomId(`${message.author.id}_delete_100`),
                new ButtonBuilder()
                    .setLabel("İptal")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji(`${client.emoji("emote_false") !== null ? client.emoji("emote_false") : "❌"}`)
                    .setCustomId(`${message.author.id}_delete_iptal`)
            )

        if (!args[0]) return message.reply({ components: [buttons], embeds: [parsher_embed.setDescription(`> **Silinecek Mesajın Adet Tipini Seçiniz!**`).setThumbnail(message.guild.iconURL({ forceStatic: true, dynamic: true }))] })
        if ((args[0] && isNaN(args[0])) || Number(args[0]) < 1 || Number(args[0]) > 100) return message.reply({ embeds: [parsher_embed.setDescription(`> **Eksik Komut Kullandınız!** *${config.prefix}sil <0-100>*`)] }).sil(5);
        message.channel.bulkDelete(Number(args[0]))
        message.channel.send(`> **${args[0]}** *Adet Mesaj Silindi!*`).sil(10);

    }
}

client.on(Events.InteractionCreate, async (parsher) => {
    if (!parsher.isButton()) return;
    switch (parsher.customId) {
        case `${parsher.member.id}_delete_10`:
            parsher.reply({ content: `> **İşlem Başarılı!**`, ephemeral: true })
            parsher.message.delete();
            parsher.channel.bulkDelete(10)
            break;
        case `${parsher.member.id}_delete_25`:
            parsher.reply({ content: `> **İşlem Başarılı!**`, ephemeral: true })
            parsher.message.delete();
            parsher.channel.bulkDelete(25)
            break;
        case `${parsher.member.id}_delete_50`:
            parsher.reply({ content: `> **İşlem Başarılı!**`, ephemeral: true })
            parsher.message.delete();
            parsher.channel.bulkDelete(50)
            break;
        case `${parsher.member.id}_delete_100`:
            parsher.reply({ content: `> **İşlem Başarılı!**`, ephemeral: true })
            parsher.message.delete();
            parsher.channel.bulkDelete(100)
            break;
        case `${parsher.member.id}_delete_iptal`:
            parsher.reply({ content: `> **İşlem Başarılı!**`, ephemeral: true })
            parsher.message.delete();
            break;
    }
})