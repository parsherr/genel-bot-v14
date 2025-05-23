const {PermissionFlagsBits,ChannelType} = require("discord.js");
const config = require("../../../config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "voice-say",
    usage:"voice-say",
    category:"moderasyon",
    aliases: ["sesli-say","vs","vsay","sessay"],
    execute: async (client, message, args, parsher_embed) => {
    let tagData = await db.get("five-tags") || [];
    if(!message.member.permissions.has(PermissionFlagsBits.Administrator))return message.reply({ embeds: [parsher_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);
    let topses = message.guild.members.cache.filter(pars => pars.voice.channel);
    let sesli = topses.size
    let stream = topses.filter(pars => pars.voice.streaming).size;
    let mic = topses.filter(pars => pars.voice.selfMute).size;
    let speaker = topses.filter(pars => pars.voice.selfDeaf).size;

    message.reply({ embeds: [parsher_embed.setDescription(`> **Sesli Kanallarda ${client.sayıEmoji(sesli)} Üye Bulunuyor!**\n\n> **Mikrofonu Kapalı ${client.sayıEmoji(mic)} Kişi Seste Bulunuyor!**\n> **Kulaklığı Kapalı ${client.sayıEmoji(speaker)} Kişi Seste Bulunuyor!**\n> **Yayında Olan ${client.sayıEmoji(stream)} Kişi Seste Bulunuyor!**`).setThumbnail(message.guild.iconURL({dynamic:true})).setTitle(`Sesli Kanallar İstatistik`).setURL(`${message.url}`)] });
    }
}