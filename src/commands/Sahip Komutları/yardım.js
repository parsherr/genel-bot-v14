const { PermissionFlagsBits, ActionRowBuilder, Events, StringSelectMenuBuilder, EmbedBuilder, codeBlock } = require("discord.js");
const config = require("../../../config");
const client = global.client;
const canvafy = require('canvafy');
const db = client.db;

module.exports = {
    name: "yardım",
    usage: "yardım",
    category: "sahip",
    aliases: ["help", "h"],
    execute: async (client, message, args, parsher_embed) => {
        let staffData = await db.get("five-ban-staff") || [];
        if (!staffData.length > 0) console.error("Ban Yetkilisi Ayarlı Değil!");
        if (!staffData.some(parsher => message.member.roles.cache.get(parsher)) &&
            !message.member.permissions.has(PermissionFlagsBits.Administrator) &&
            !message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return message.reply({ embeds: [parsher_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);
        }
        client.true(message);

        // Create the embed message
        const helpEmbed = new EmbedBuilder()
            .setTitle("Yardım Menüsü")
            .setImage("https://media.discordapp.net/attachments/1087824262322212975/1115390850248229014/standard_12.gif?ex=6669696d&is=666817ed&hm=59917bf6607683cd9ed63d59c743ada3a1f7092692976f09d17190c3b272d399&")
            .setDescription("Komutlar hakkında bilgi almak için aşağıdaki menüden bir kategori seçin.")
            .setFooter({ text: "Parsher yardım menüsü"})
            .setColor("#1e1f22");

        // Create the dropdown menu
        let menu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setOptions([
                    { value: `genelkomutlar`, description: `Genel Komutları Gösterir`, label: `Genel Komutlar`, emoji: `${client.emoji("emote_value") !== null ? client.emoji("emote_value") : "⚕️"}` },
                    { value: `statkomutlar`, description: `Stat Komutlarını Gösterir`, label: `Stat Komutları`, emoji: `${client.emoji("emote_value") !== null ? client.emoji("emote_value") : "⚕️"}` },
                    { value: `kayıtkomutlar`, description: `Kayıt Komutlarını Gösterir`, label: `Kayıt Komutları`, emoji: `${client.emoji("emote_value") !== null ? client.emoji("emote_value") : "⚕️"}` },
                    { value: `moderasyonkomutlar`, description: `Moderasyon Komutlarını Gösterir`, label: `Moderasyon Komutları`, emoji: `${client.emoji("emote_value") !== null ? client.emoji("emote_value") : "⚕️"}` },
                    { value: `rolkomutlar`, description: `Rol Komutlarını Gösterir`, label: `Rol Komutlarını`, emoji: `${client.emoji("emote_value") !== null ? client.emoji("emote_value") : "⚕️"}` },
                    { value: `sahipkomutlar`, description: `Sahip Komutlarını Gösterir`, label: `Sahip Komutları`, emoji: `${client.emoji("emote_value") !== null ? client.emoji("emote_value") : "⚕️"}` },
                    { value: `üstytkomutlar`, description: `Üst Yetkili Komutlarını Gösterir`, label: `Üst Yetkili Komutlarını`, emoji: `${client.emoji("emote_value") !== null ? client.emoji("emote_value") : "⚕️"}` }
                ])
                .setCustomId("yardım")
                .setPlaceholder(`❓ | ${client.commands.size} Adet Komut Bulunmakta!`)
        );

        // Send the embed and the menu
        message.channel.send({ embeds: [helpEmbed], components: [menu] });
    }
};

client.on(Events.InteractionCreate, async (parsher) => {
    if (!parsher.isStringSelectMenu()) return;
    let value = parsher.values[0];
    if (parsher.customId == "yardım") {
        switch (value) {
            case "genelkomutlar":
                let cmd = commandShow("genel");
                parsher.reply({ ephemeral: true, content: codeBlock("fix", `${cmd.map(pars => `${config.prefix}${pars.usage}`).join("\n")}`) });
                break;
            case "kayıtkomutlar":
                let cmd2 = commandShow("kayıt");
                parsher.reply({ ephemeral: true, content: codeBlock("fix", `${cmd2.map(pars => `${config.prefix}${pars.usage}`).join("\n")}`) });
                break;
            case "moderasyonkomutlar":
                let cmd3 = commandShow("moderasyon");
                parsher.reply({ ephemeral: true, content: codeBlock("fix", `${cmd3.map(pars => `${config.prefix}${pars.usage}`).join("\n")}`) });
                break;
            case "rolkomutlar":
                let cmd4 = commandShow("rol");
                parsher.reply({ ephemeral: true, content: codeBlock("fix", `${cmd4.map(pars => `${config.prefix}${pars.usage}`).join("\n")}`) });
                break;
            case "sahipkomutlar":
                if (!config.botOwners.some(pars => parsher.user.id == pars)) return parsher.reply({ content: `> **Bot Sahibi Değilsin!**`, ephemeral: true });
                let cmd5 = commandShow("sahip");
                parsher.reply({ ephemeral: true, content: codeBlock("fix", `${cmd5.map(pars => `${config.prefix}${pars.usage}`).join("\n")}`) });
                break;
            case "üstytkomutlar":
                let cmd6 = commandShow("üstyt");
                parsher.reply({ ephemeral: true, content: codeBlock("fix", `${cmd6.map(pars => `${config.prefix}${pars.usage}`).join("\n")}`) });
                break;
            case "statkomutlar":
                let cmd7 = commandShow("stat");
                parsher.reply({ ephemeral: true, content: codeBlock("fix", `${cmd7.map(pars => `${config.prefix}${pars.usage}`).join("\n")}`) });
                break;
        }
    }
});

function commandShow(name) {
    let cmd = client.commands.filter(pars => pars.category && pars.category == name.toLowerCase());
    return cmd ? cmd : null;
}