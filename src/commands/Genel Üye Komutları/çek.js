const { PermissionFlagsBits, ButtonStyle, ButtonBuilder, ActionRowBuilder, Events, EmbedBuilder, StringSelectMenuBuilder } = require("discord.js");
const config = require("../../../config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "çek",
    usage: "çek [@parsher / ID]",
    category:"genel",
    aliases: ["pull", "çek", "yanıma-çek"],
    execute: async (client, message, args, parsher_embed) => {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!message.member.voice.channel) return message.reply({ embeds: [parsher_embed.setDescription(`> **Öncelikle Bir Ses Kanalında Bulunman Gerekli!**`)] }).sil(5);
        if (!member || !member.voice.channel || member.id === message.author.id) return message.reply({ embeds: [parsher_embed.setDescription(`> **Seste Bulunan Geçerli Bir User Belirt!**`)] }).sil(5);
        if(member.voice.channel.id == message.member.voice.channel.id)return message.reply({ embeds: [parsher_embed.setDescription(`> **Zaten Aynı Kanaldasınız!**`)] }).sil(5);

        const parsher_dropdown = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('tasıma')
                    .setPlaceholder(`${member.displayName} Onayla / Reddet`)
                    .addOptions([
                        { label: `Onayla`, description: `Taşıma İşlemini Onayla`, value: `onay`, emoji: `${client.emoji("emote_true") !== null ? client.emoji("emote_true") : "✅"}` },
                        { label: `Reddet`, description: `Taşıma İşlemini Reddet`, value: `red`, emoji: `${client.emoji("emote_false") !== null ? client.emoji("emote_false") : "❌"}` }]))
        let mesajparsher;
        if (message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            if (message.member.voice.channel && member.voice.channel) member.voice.setChannel(message.member.voice.channel);
            message.reply({ embeds: [parsher_embed.setDescription(`> **Başarıyla Kullanıcıyı Kanalınıza Çektiniz!**`).setColor("#00ff00")] }).sil(5);
            client.true(message)
        } else {
            mesajparsher = message.reply({ content: `> **${member}, ${message.author} \`${member.voice.channel.name}\` Adlı Kanala Sizi Çekmek İstiyor, Kabul Ediyomusun?**`, components: [parsher_dropdown] })

            mesajparsher.then(b2 => {
                const filter = i => i.user.id === member.id;
                const collector = b2.createMessageComponentCollector({ filter: filter, time: 30000, max: 1 });
                collector.on('end', async (pars) => {
                    if (pars.size !== 0) return;
                    parsher_dropdown.components[0].setDisabled(true);
                    b2.edit({ content: `> **İşlem Süresi Doldu!** *Menu Deaktif Kılındı!*`, components: [parsher_dropdown] })
                    client.false(message);
                })
                collector.on('collect', async b => {
                    if (!b.isStringSelectMenu()) return;
                    const value = b.values[0]
                    if (value === "onay") {
                        client.true(message)
                        message.reply({ embeds: [parsher_embed.setDescription(`> **Taşıma İşlemi Onaylandı!**`).setColor("#00ff00")] }).sil(5);
                        if (message.member.voice.channel && member.voice.channel) member.voice.setChannel(message.member.voice.channel);
                    }
                    if (value === "red") {
                        client.false(message)
                        message.reply({ embeds: [parsher_embed.setDescription(`> **Taşıma İşlemi Reddedildi!**`).setColor("#ff0000")] }).sil(5);
                    }
                    collector.stop()
                    b.message.delete().catch(e => { })
                })
            })
        }

    }
}
