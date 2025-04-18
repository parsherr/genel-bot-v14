const {PermissionFlagsBits} = require("discord.js");
const config = require("../../../config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "kayıtsız",
    usage:"kayıtsız [@parsher / ID]",
    category:"kayıt",
    aliases: ["unregister", "unreg"],
    execute: async (client, message, args, parsher_embed) => {
        var member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        
        let staffData = await db.get("five-register-staff") || [];
        let unregisterRoles = await db.get("five-unregister-roles") || [];
        if(!staffData.length > 0)return console.error("Kayıt Yetkilisi Ayarlı Değil!");
        if(!unregisterRoles.length > 0)return console.error("Kayıtsız Rolleri Ayarlı Değil!");
        if(!staffData.some(parsher => message.member.roles.cache.get(parsher)) && !message.member.permissions.has(PermissionFlagsBits.Administrator))return message.reply({ embeds: [parsher_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);
        const kyapan = await client.users.fetch(message.author.id)
        if(!member) return message.reply({ embeds: [parsher_embed.setDescription(`> **Geçerli Bir User Belirt!**`)] }).sil(5);
        if(member.id == message.author.id) return message.reply({ embeds: [parsher_embed.setDescription(`> **Kendine İşlem Uygulayamazsın!**`)]}).sil(5);
        if(member.user.bot) return message.reply({ embeds: [parsher_embed.setDescription(`> **Bir Bot'a İşlem Uygulayamazsın!**`)]}).sil(5);
        db.push(`isimler-${member.id}`, `${member.user.tag} (Kayıtsız <t:${Math.floor(Date.now() / 1000)}> - ${kyapan.tag})`);
        db.push(`kayıtlar-${message.author.id}`, `${member.user.tag} (Kayıtsız <t:${Math.floor(Date.now() / 1000)}>)`);
        await message.guild.members.cache.get(member.id).setNickname(`${config.kayitsizHesapIsim}`);
        await member.roles.cache.has(message.guild.roles.premiumSubscriberRole ? message.guild.roles.premiumSubscriberRole.id : "5") ? member.roles.set([message.guild.roles.premiumSubscriberRole.id,...unregisterRoles]) : member.roles.set([...unregisterRoles])
        message.reply({ embeds: [parsher_embed.setDescription(`> **${member} Kullanıcısı Başarıyla Kayıtsıza Atıldı!**`)] })



    }
}
