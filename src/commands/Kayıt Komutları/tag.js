const {PermissionFlagsBits} = require("discord.js");
const config = require("../../../config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "tag",
    usage:"tag",
    category:"kayıt",
    aliases: ["tags","taglar"],
    execute: async (client, message, args, parsher_embed) => {
    let tagData = await db.get("five-tags") || [];
    if(!tagData.length > 0) return message.reply({ embeds:[parsher_embed.setDescription(`> **Bu Sunucuda Tag Bulunmamakta!**`)]}).sil(5);
    return message.reply({content:`> ${tagData.map((pars) => `**${pars}**`).join(",")}`});
    }
}