const client = global.client;
const { EmbedBuilder, Events,codeBlock } = require("discord.js");
const config = require("../../config");
const ms = require('ms');
const db = client.db;
module.exports = async (message) => {
    let chatChannel = await db.get("five-channel-chat");
    let unregisterRoles = await db.get("five-unregister-roles") || [];
    let jailRoles = await db.get("five-jail-roles") || [];
    if (config.prefix && !message.content.startsWith(config.prefix) || message.guild.id !== config.guildID)return;
    if(unregisterRoles.length > 0 && jailRoles.length > 0 && unregisterRoles.some(pars => message.member.roles.cache.has(pars)) && jailRoles.some(pars => message.member.roles.cache.has(pars)))return client.false(message);
    const args = message.content.slice(1).trim().split(/ +/g);
    const commands = args.shift().toLowerCase();
    const cmd = client.commands.get(commands) || [...client.commands.values()].find((e) => e.aliases && e.aliases.includes(commands));
    if(chatChannel && message.channel.id == chatChannel && !["snipe","tag","afk"].some(pars => cmd.name == pars)) return client.false(message);
    const parsher_embed = new EmbedBuilder()
    .setColor(`#2b2d31`)
    .setAuthor({ name: message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })
    .setFooter({ text: config.footer ? config.footer : `parsher Was Here`, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })

    if (cmd) {
        cmd.execute(client, message, args, parsher_embed);
        if(client.kanalbul("command-log")){
            client.kanalbul("command-log").send({
                embeds: [new EmbedBuilder().setColor(`#2b2d31`).setDescription(`> **${message.member} Kullanıcısı <t:${Math.floor(Date.now()/1000)}:R> Önce ${message.channel} Kanalında \`${cmd.name}\` Komudunu Kullandı!**`).addFields(
                    { name: `Kullanılan Komut`, value: `${codeBlock("fix",config.prefix+cmd.name)}`, inline: false },
                    { name: `Kullanan Kişi`, value: `${codeBlock("fix", message.author.tag + " / " + message.author.id)}`, inline: false },
                    { name: `Tarih / Zaman`, value: `**<t:${Math.floor(Date.now()/1000)}> (<t:${Math.floor(Date.now()/1000)}:R>)**`, inline: false }
                )]
            })
        }
    }
}
module.exports.conf = { name: Events.MessageCreate }
