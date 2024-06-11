const client = global.client;
const { EmbedBuilder, Events, codeBlock } = require("discord.js");
const config = require("../../config");
const db = client.db;
const ms = require('ms');
module.exports = async (oldMessage,newMessage) => {
    let chatChannel = await db.get("five-channel-chat");
    if(chatChannel && newMessage.channel.id == chatChannel) return;
    let unregisterRoles = await db.get("five-unregister-roles") || [];
    let jailRoles = await db.get("five-jail-roles") || [];
    if (config.prefix && !newMessage.content.startsWith(config.prefix) || newMessage.guild.id !== config.guildID)return;
    if(unregisterRoles.length > 0 && jailRoles.length > 0 && unregisterRoles.some(pars => newMessage.member.roles.cache.has(pars)) && jailRoles.some(pars => newMessage.member.roles.cache.has(pars)))return client.false(newMessage);
    const args = newMessage.content.slice(1).trim().split(/ +/g);
    const commands = args.shift().toLowerCase();
    const cmd = client.commands.get(commands) || [...client.commands.values()].find((e) => e.aliases && e.aliases.includes(commands));
    const parsher_embed = new EmbedBuilder()
    .setColor(`#2b2d31`)
    .setAuthor({ name: newMessage.member.displayName, iconURL: newMessage.author.avatarURL({ dynamic: true, size: 2048 }) })
    .setFooter({ text: config.footer ? config.footer : `parsher Was Here`, iconURL: newMessage.author.avatarURL({ dynamic: true, size: 2048 }) })
    if (cmd) {
    cmd.execute(client, newMessage, args, parsher_embed);
    if(client.kanalbul("command-log")){
        client.kanalbul("command-log").send({
            embeds: [new EmbedBuilder().setColor(`#2b2d31`).setDescription(`> **${newMessage.member} Kullanıcısı <t:${Math.floor(Date.now()/1000)}:R> Önce ${newMessage.channel} Kanalında \`${cmd.name}\` Komudunu Kullandı!**`).addFields(
                { name: `Kullanılan Komut`, value: `${codeBlock("fix",config.prefix+cmd.name)}`, inline: false },
                { name: `Kullanan Kişi`, value: `${codeBlock("fix", newMessage.author.tag + " / " + newMessage.author.id)}`, inline: false },
                { name: `Tarih / Zaman`, value: `**<t:${Math.floor(Date.now()/1000)}> (<t:${Math.floor(Date.now()/1000)}:R>)**`, inline: false }
            )]
        })
    }
    }
}
module.exports.conf = { name: Events.MessageUpdate }
