const {PermissionFlagsBits} = require("discord.js");
const config = require("../../../config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "ban",
    usage:"ban [@parsher / ID] <sebep>",
    category:"moderasyon",
    aliases: ["bans", "yasakla","yasaklama"],
    execute: async (client, message, args, parsher_embed) => {
        var member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let reason = args.slice(1).join(' ');
        let staffData = await db.get("five-ban-staff") || [];
        let limitData = await db.get(`banlimit-${message.author.id}`) || 0;
        if(!staffData.length > 0)console.error("Ban Yetkilisi Ayarlı Değil!");
        if(!staffData.some(parsher => message.member.roles.cache.get(parsher)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers))return message.reply({ embeds: [parsher_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);
        if(!member) return message.reply({ embeds: [parsher_embed.setDescription(`> **Geçerli Bir User Belirt!**`)] }).sil(5);
        if(member.id == message.author.id) return message.reply({ embeds: [parsher_embed.setDescription(`> **Kendine İşlem Uygulayamazsın!**`)]}).sil(5);
        if(member.user.bot) return message.reply({ embeds: [parsher_embed.setDescription(`> **Bir Bot'a İşlem Uygulayamazsın!**`)]}).sil(5);
        if(member.roles.highest.position >= message.member.roles.highest.position) return message.reply({ embeds: [parsher_embed.setDescription(`> **Kendinden Üst/Aynı Pozisyondaki Birine İşlem Uygulayamazsın!**`)]}).sil(5);
        if (limitData >= config.limit.banLimit)return message.reply({ embeds: [parsher_embed.setDescription(`> **Banlama Limitin Dolmuş Durumda, Lütfen Sonra Tekrar Dene!**`)]}).sil(5);
        if (reason.length < 1)return message.reply({ embeds: [parsher_embed.setDescription(`> **Geçerli Bir Sebep Belirt!**`)]}).sil(5);
        if(!member.bannable)return message.reply({ embeds: [parsher_embed.setDescription(`> **Belirtilen User'a İşlem Yapmaya Yetkim Yetmiyor!**`)]}).sil(5);

        await member.send({content:`> **\`${reason}\` Sebebiyle ${message.guild.name} Adlu Sunucudan ${message.author.tag} Tarafından Yasaklandın!**`}).catch(err => { })
        setTimeout(async() => {
        message.guild.members.ban(member.id, { reason: reason });
        await client.ceza(member.id,message,"BAN",reason,Date.now())
        db.add(`banlimit-${message.author.id}`,1);
        }, 2000);

    }
}
