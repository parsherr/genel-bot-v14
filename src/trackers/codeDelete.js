const { Events, EmbedBuilder,Collection } = require("discord.js")
const client = global.client;
const config = require("../../config");
const delay = require("delay")
module.exports = async (invite) => {
await delay(5000);
const invites = new Collection();
invite.guild.invites.fetch().then((pars) => {
pars.map((x) => {invites.set(x.code, {uses: x.uses, inviter: x.inviter, code: x.code });
});
client.invites.set(invite.guild.id, invites);
});
}
module.exports.conf = {name:Events.InviteDelete}