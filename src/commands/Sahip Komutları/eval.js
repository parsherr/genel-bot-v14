const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Modal, TextInputBuilder, OAuth2Scopes, Partials, resolveColor, Client, Collection, GatewayIntentBits, SelectMenuBuilder, ActivityType } = require("discord.js");
const moment = require("moment");
const ms = require("ms");
const config = require("../../../config")
module.exports = {
    name: "eval", 
    category:"sahip",
    usage:"eval",
    aliases: [], execute: async (client, message, args, parsher_embed) => {
        if (!config.botOwners.some(pars => message.author.id == pars)) return;
        if (!args[0]) return message.reply({ content: `> **Kod Nerede Canımın İçi!**` });
        let code = args.join(" ");
        if (code.includes(client.token)) return message.reply({ content: "> **Bu Token parsher Tarafından Koruma Altında ;)**" });
        try {
            var sonuç = eval_parsher(await eval(code));
            if (sonuç.includes(client.token))
                return message.reply({ content: "> **Bu Token parsher Tarafından Koruma Altında ;)**" });
        } catch (err) { }
    },
}; function eval_parsher(parsher) { if (typeof text !== "string") parsher = require("util").inspect(parsher, { depth: 0 }); parsher = parsher.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)); return parsher; }