const { PermissionFlagsBits, ButtonStyle, ButtonBuilder, ActionRowBuilder, Events, EmbedBuilder, codeBlock, Embed } = require("discord.js");
const config = require("../../../config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "snipe",
    usage: "snipe",
    category:"genel",
    aliases: ["snipes", "sonsilinen"],
    fives: async(client,message) =>{
    db.set(`snipe-${message.channel.id}`,{content: message.content,author: message.author.id,date:Date.now()})
    },
    execute: async (client, message, args, parsher_embed) => {
     let data = db.get(`snipe-${message.channel.id}`)
     if(!data) return message.reply({ embeds: [parsher_embed.setDescription(`> **Bu Kanalda Silinen Bir Mesaj Bulunmamakta!**`)] }).sil(5);
     client.true(message)
     return message.channel.send({ embeds: [parsher_embed.addFields(
    {name:`Mesaj İçeriği`,value:`${codeBlock("fix",`${["www", ".com", "discord.gg", ".gg", "discord"].some(pars => data.content.includes(pars)) ? `(Reklam)` : data.content}`)}`,inline:false},
    {name:`Mesaj Sahibi`,value:`**<@!${data.author}> (\`${data.author}\`)**`,inline:false},
    {name:`Silinme Zamanı`,value:`**<t:${Math.floor(data.date/1000)}:R>**`,inline:false}
     )] }).sil(10);
    }
}
client.on(Events.MessageDelete,async(message) => {
if (!message.guild || message.author.bot == null || message.author.bot || message.content == null)return;
const snipes = client.commands.find(pars => pars.name == "snipe");
if(snipes){snipes.fives(client,message)}
if(client.kanalbul("message-log")){
 client.kanalbul("message-log").send({ embeds: [new EmbedBuilder().setColor("#ff0000").addFields(
    {name:`Mesaj İçeriği`,value:`${codeBlock("fix",`${message.content}`)}`,inline:false},
    {name:`Mesaj Sahibi`,value:`**<@!${message.author.id}> (\`${message.author.id}\`)**`,inline:false},
    {name:`Silinme Zamanı`,value:`**<t:${Math.floor(Date.now()/1000)}:R>**`,inline:false}
     )] })   
}
})