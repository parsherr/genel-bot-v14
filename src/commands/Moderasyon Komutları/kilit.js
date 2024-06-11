const {PermissionFlagsBits, PermissionsBitField, Events, EmbedBuilder,ActionRowBuilder,ButtonStyle,ButtonBuilder} = require("discord.js");
const config = require("../../../config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "kilit",
    usage:"kilit",
    category:"moderasyon",
    aliases: ["kanal-kilit", "kanalkilit","kilitle","kilitaç","kilitkapat"],
    execute: async (client, message, args, parsher_embed) => {
        let staffData = await db.get("five-ban-staff") || [];
        if(!staffData.length > 0)console.error("Ban Yetkilisi Ayarlı Değil!");
        if(!staffData.some(parsher => message.member.roles.cache.get(parsher)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers))return message.reply({ embeds: [parsher_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);

        let button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId(`lockackapa-${message.member.id}`)
        .setStyle(!message.channel.permissionsFor(message.guild.roles.cache.find(pars => pars.name == "@everyone")).has(PermissionFlagsBits.SendMessages) ? ButtonStyle.Danger : ButtonStyle.Success)
        .setEmoji(!message.channel.permissionsFor(message.guild.roles.cache.find(pars => pars.name == "@everyone")).has(PermissionFlagsBits.SendMessages) ? "🔒" : "🔓")    
        .setLabel(!message.channel.permissionsFor(message.guild.roles.cache.find(pars => pars.name == "@everyone")).has(PermissionFlagsBits.SendMessages) ? "Kilitle" : "Kilit Aç")
        )

        client.true(message)
        if (message.channel.permissionsFor(message.guild.roles.cache.find(pars => pars.name == "@everyone")).has(PermissionFlagsBits.SendMessages)) {
            await message.channel.permissionOverwrites.edit(message.guild.roles.cache.find(pars => pars.name == "@everyone").id, { SendMessages: false });
            return message.reply({components:[button], embeds: [new EmbedBuilder().setDescription(`> **\`🔒\` Kanal ${message.author} Tarafından Kilitlendi!**`).setColor("#ff0000")] });
          } else {
            await message.channel.permissionOverwrites.edit(message.guild.roles.cache.find(pars => pars.name == "@everyone").id, { SendMessages: true });
            return message.reply({components:[button], embeds: [new EmbedBuilder().setDescription(`> **\`🔓\` Kanalın Kilidi ${message.author} Tarafından Açıldı!**`).setColor("#00ff00")] });
          };
    }
}

client.on(Events.InteractionCreate,async(parsher) => {
 if(!parsher.isButton())return;
 if(parsher.customId == `lockackapa-${parsher.member.id}`){
    parsher.message.delete().catch(err => { });
    if (parsher.channel.permissionsFor(parsher.guild.roles.cache.find(pars => pars.name == "@everyone")).has(PermissionFlagsBits.SendMessages)) {
        await parsher.channel.permissionOverwrites.edit(parsher.guild.roles.cache.find(pars => pars.name == "@everyone").id, { SendMessages: false });
        return parsher.channel.send({ embeds: [new EmbedBuilder().setDescription(`> **\`🔒\` Kanal ${parsher.member} Tarafından Kilitlendi!**`).setColor("#ff0000")] });
      } else {
        await parsher.channel.permissionOverwrites.edit(parsher.guild.roles.cache.find(pars => pars.name == "@everyone").id, { SendMessages: true });
        return parsher.channel.send({ embeds: [new EmbedBuilder().setDescription(`> **\`🔓\` Kanalın Kilidi ${parsher.member} Tarafından Açıldı!**`).setColor("#00ff00")] });
      };
 }  
})