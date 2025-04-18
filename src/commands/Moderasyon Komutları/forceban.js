const {PermissionFlagsBits} = require("discord.js");
const config = require("../../../config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "forceban",
    usage:"forceban [@parsher / ID] <sebep>",
    category:"moderasyon",
    aliases: ["forcebans", "forceyasakla","forceyasaklama","kalkmazban","kalkmaz-ban"],
    execute: async (client, message, args, parsher_embed) => {
        var member = message.mentions.users.first() || await client.users.fetch(args[0]);
        let reason = args.slice(1).join(' ');
        let forcedata = await db.get(`forcebans`) || [];
        if(!message.member.permissions.has(PermissionFlagsBits.Administrator))return message.reply({ embeds: [parsher_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);
        if(!member) return message.reply({ embeds: [parsher_embed.setDescription(`> **Geçerli Bir User Belirt!**`)] }).sil(5);
        if(member.id == message.author.id) return message.reply({ embeds: [parsher_embed.setDescription(`> **Kendine İşlem Uygulayamazsın!**`)]}).sil(5);
        if(member.bot) return message.reply({ embeds: [parsher_embed.setDescription(`> **Bir Bot'a İşlem Uygulayamazsın!**`)]}).sil(5);
        if (reason.length < 1)return message.reply({ embeds: [parsher_embed.setDescription(`> **Geçerli Bir Sebep Belirt!**`)]}).sil(5);
        if(forcedata.includes(member.id)) return message.reply({ embeds: [parsher_embed.setDescription(`> **Belirtilen Üyenin Zaten Bir Kalıcı Yasaklaması Bulunmakta!**`)]}).sil(5);
        message.guild.members.ban(member.id, { reason: reason });
        await client.ceza(member.id,message,"FORCEBAN",reason,Date.now())

    }
} 