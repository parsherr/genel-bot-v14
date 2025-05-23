const { Events, EmbedBuilder, Collection } = require("discord.js")
const client = global.client;
const config = require("../../config");
const inviteDatas = require("../schemas/invitesSchema")
module.exports = async (member) => {
const pars = new Collection();
member.guild.invites.fetch().then((pars) => {
pars.map((x) => {pars.set(x.code, {uses: x.uses, inviter: x.inviter, code: x.code });
});
client.invites.set(member.guild.id, pars);
});

let createTime = (Date.now() - member.user.createdTimestamp) >= 7*24*60*60*1000;
let url = member.guild.premiumTier == 3 ? await member.guild.fetchVanityData().then(pars => pars.uses) : 1;
let data = await inviteDatas.findOne({ guildId: member.guild.id, userId: member.id });
if (!data || !data.inviter || data.inviter == null || data.inviter == undefined) {
fiveSender(`**${member.user.tag} Adlı Kullanıcı <t:${Math.floor(Date.now()/1000)}:R> Sunucudan Ayrıldı!**\n> **\`Davet Eden;\` Bulunamadı**`)
}else if(data.inviter == member.guild.id){
fiveSender(`**${member.user.tag} Adlı Kullanıcı <t:${Math.floor(Date.now()/1000)}:R> Sunucudan Ayrıldı!**\n> **\`Davet Eden;\` Özel URL ( Toplam Daveti ${client.sayıEmoji(url)} )**`)
}else {
if(data.inviter == member.user.id){
return fiveSender(`**${member.user.tag} Adlı Kullanıcı <t:${Math.floor(Date.now()/1000)}:R> Sunucudan Ayrıldı!**\n> **\`Davet Eden;\` Kendi Daveti**`)
}
if(createTime){
var inviter = await client.users.fetch(data.inviter);
let taskMember = member.guild.members.cache.get(data.inviter);
if(taskMember && client.kanalbul("invite-log")){taskMember.updateTask(member.guild.id, "invite", -1, client.kanalbul("invite-log"))}
await inviteDatas.findOneAndUpdate({guildId: member.guild.id, userId: inviter.id }, { $inc: { Regular: -1, Left: 1 } }, { upsert: true });
let datapars = await inviteDatas.findOne({ guildId: member.guild.id, userId: inviter.id });
let toplam = datapars ? datapars.Regular : 0;
fiveSender(`**${member.user.tag} Adlı Kullanıcı <t:${Math.floor(Date.now()/1000)}:R> Sunucudan Ayrıldı!**\n> **\`Davet Eden;\` ${inviter.tag} ${toplam > 0 ? `( Toplam Daveti ${client.sayıEmoji(parseInt(toplam))} )` : " "}**`)
}else {
let taskMember = member.guild.members.cache.get(data.inviter);
if(taskMember && client.kanalbul("invite-log")){taskMember.updateTask(member.guild.id, "invite", -1, client.kanalbul("invite-log"))}
await inviteDatas.findOneAndUpdate({guildId: member.guild.id, userId: inviter.id }, { $inc: { Fake: -1, Left: 1 } }, { upsert: true });
let datapars = await inviteDatas.findOne({ guildId: member.guild.id, userId: inviter.id });
let toplam = datapars ? datapars.Regular : 0;
fiveSender(`**${member.user.tag} Adlı Kullanıcı <t:${Math.floor(Date.now()/1000)}:R> Sunucudan Ayrıldı!**\n> **\`Davet Eden;\` ${inviter.tag} ${toplam > 0 ? `( Toplam Daveti ${client.sayıEmoji(parseInt(toplam))} )` : " "}**`,1)
}}

}
module.exports.conf = { name: Events.GuildMemberRemove }

function fiveSender(message,pars = 0) {
    let log = client.kanalbul("invite-log");
    if (!log) return console.error("Sunucuda invite-log Adında Kanal Bulunmadığı İçin Davet Mesajı Gönderemedim!");
    let embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription(`> ${pars == 0 ? client.emoji("emote_false") ? client.emoji("emote_false") : "❌" : client.emoji("emote_warn") ? client.emoji("emote_warn") : "⚠️"} ${message}`)
    log.send({ embeds: [embed] })
}