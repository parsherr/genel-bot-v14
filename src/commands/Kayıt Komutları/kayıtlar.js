const {PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const config = require("../../../config")
const client = global.client;
const db = client.db;
module.exports = {
    name: 'kayıtlar',
    usage:"kayıtlar [@parsher]",
    category:"kayıt",
    aliases: ["registers","kayıtları","reg-stat","kayıtsayı","reg","kayıtlarım"],
    execute: async (client, message, args, parsher_embed) => {
        var member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
       let staffData = await db.get("five-register-staff") || [];
       if(!staffData.length > 0)console.error("Kayıt Yetkilisi Ayarlı Değil!");
       let erkek = await db.get(`erkek-${member.id}`) || 0;
       let kadın = await db.get(`kadın-${member.id}`) || 0;
        if(!staffData.some(parsher => message.member.roles.cache.get(parsher)) && !message.member.permissions.has(PermissionFlagsBits.Administrator))return message.reply({ embeds: [parsher_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);
        if (!member) return message.reply({ embeds: [parsher_embed.setDescription(`> **Geçerli Bir User Belirt!**`)] }).sil(5);
        if(member.user.bot) return message.reply({ embeds: [parsher_embed.setDescription(`> **Bir Bot'a İşlem Uygulayamazsın!**`)]}).sil(5);
        let names = db.get(`kayıtlar-${member.id}`);
        if (!names) return message.reply({ embeds: [parsher_embed.setDescription(`> **${member} Kullanıcısının Kayıt Verisi Bulunmamakta!**`)] }).sil(5);
        if(names && names.length <= 10){
        message.reply({ embeds: [parsher_embed.setTitle("Kullanıcının Geçmiş Verileri").setFooter({text:`Kayıt Sayı: Erkek; ${erkek} | Kadın; ${kadın} | Toplam ${(erkek+kadın)}`}).setDescription(names.map((data, n) => `${data}`).join("\n"))] })
        }else {
       let pages = 1;
       const parsher_buttons = new ActionRowBuilder()
      .addComponents(
		new ButtonBuilder()
        .setCustomId("parsher_back")
        .setLabel("⬅️")
        .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
        .setCustomId("parsher_exit")
        .setLabel("🗑️")
        .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
        .setCustomId("parsher_skip")
        .setLabel("➡️")
        .setStyle(ButtonStyle.Secondary)
		);
        client.true(message)
       let mesaj = await message.reply({components:[parsher_buttons], embeds: [
        parsher_embed.setTitle("Kullanıcının Kayıt Geçmişi").setDescription(`${names.slice(pages == 1 ? 0 : pages * 10 - 10, pages * 10).map((data, n) => `${data}`).join("\n")}`).setFooter({text:`Sayfa #${pages} / Erkek; ${erkek} | Kadın; ${kadın} | Toplam ${(erkek+kadın)}`})] })
        
        const filter = i => i.user.id === message.member.id;
        const collector = mesaj.createMessageComponentCollector({filter:filter, time: 120000});
        collector.on("collect",async (parsher) => {
            if (parsher.customId == "parsher_skip") {
                if (names.slice((pages + 1) * 10 - 10, (pages + 1) * 10).length <= 0)return parsher.reply({ephemeral:true,content:`> **❌ Daha Fazla Veri Bulunmamakta!**`});
                pages += 1;
                let newData = names.slice(pages == 1 ? 0 : pages * 10 - 10, pages * 10).join("\n");
                await parsher.update({components:[parsher_buttons], embeds: [
                parsher_embed.setTitle("Kullanıcının Kayıt Geçmişi").setFooter({text:`Sayfa #${pages} / Erkek; ${erkek} | Kadın; ${kadın} | Toplam ${(erkek+kadın)}`}).setDescription(newData)] })
            }else
            if (parsher.customId == "parsher_back") {
                if (pages == 1)return parsher.reply({ephemeral:true,content:`> **❌ İlk Sayfadasın, Geriye Gidemezsin!**`});
                pages -= 1;
                let newData = names.slice(pages == 1 ? 0 : pages * 10 - 10, pages * 10).join("\n");
                await parsher.update({components:[parsher_buttons], embeds: [
                parsher_embed.setTitle("Kullanıcının Kayıt Geçmişi").setFooter({text:`Sayfa #${pages} / Erkek; ${erkek} | Kadın; ${kadın} | Toplam ${(erkek+kadın)}`}).setDescription(newData)] })
            }else  if (parsher.customId == "parsher_exit") {
            parsher.reply({ephemeral:true,content:`> **🗑️ Panel Başarıyla Silindi!**`})
            mesaj.delete().catch((pars) => { })
            message.delete().catch((pars) => { })
            }
        })
    }

    }
}