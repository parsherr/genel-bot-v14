const {PermissionFlagsBits} = require("discord.js");
const config = require("../../../config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "unban",
    usage:"unban [@parsher / ID]",
    category:"moderasyon",
    aliases: ["un-ban", "unyasakla","unyasaklama","bankaldır","ban-kaldır","yasaklama-kaldır"],
    execute: async (client, message, args, parsher_embed) => {
        var member = await client.users.fetch(args[0]);
        let staffData = await db.get("five-ban-staff") || [];
        let limitData = await db.get(`banlimit-${message.author.id}`) || 0;
        let forcedata = await db.get(`forcebans`) || [];
        if(!staffData.length > 0)console.error("Ban Yetkilisi Ayarlı Değil!");

        if(!staffData.some(parsher => message.member.roles.cache.get(parsher)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers))return message.reply({ embeds: [parsher_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);
        if(!member) return message.reply({ embeds: [parsher_embed.setDescription(`> **Geçerli Bir User Belirt!**`)] }).sil(5);
        if(member.id == message.author.id) return message.reply({ embeds: [parsher_embed.setDescription(`> **Kendine İşlem Uygulayamazsın!**`)]}).sil(5);
        if (limitData >= config.limit.banLimit)return message.reply({ embeds: [parsher_embed.setDescription(`> **Banlama Limitin Dolmuş Durumda, Lütfen Sonra Tekrar Dene!**`)]}).sil(5);
        if(forcedata.includes(member.id)) return message.reply({ embeds: [parsher_embed.setDescription(`> **Belirtilen Üyenin Bir Kalıcı Yasaklaması Bulunmakta!** *Yönetim Ekibiyle İletişime Geçin.*`)]}).sil(5);

        const fetchBans =  message.guild.bans.fetch()
        fetchBans.then(async (bans) => {
        let ban = await bans.find(a => a.user.id === member.id)
        if (!ban) {
        return message.reply({ embeds: [parsher_embed.setDescription(`> **Belirtilen Üyenin Bir Yasaklanması Bulunmamakta!**`)]}).sil(5);
        }else{ 
        message.guild.members.unban(member.id);
        await client.ceza(member.id,message,"UNBAN",null,Date.now())
        }
    })

    }
}