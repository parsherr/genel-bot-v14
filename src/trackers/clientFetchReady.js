const { Events,Collection } = require("discord.js");
const config = require("../../config");
const client = global.client;
module.exports = async () => {
var guild = client.guilds.cache.get(config.guildID)
if(!guild)return;
const invites = new Collection();
guild.invites.fetch().then((pars) => {
pars.map((x) => {invites.set(x.code, {uses: x.uses, inviter: x.inviter, code: x.code });
});
client.invites.set(guild.id, invites);
});
}
module.exports.conf = {name: Events.ClientReady}