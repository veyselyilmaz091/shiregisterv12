const dc = require('discord.js')
const db = require('quick.db')
const moment = require('moment')
const settings = require('../shi/settings.json')
exports.run = async (client, message, args) => {

if(!message.member.roles.cache.get(settings.roller.botcommand) && !message.member.hasPermission('ADMINISTRATOR'))
return message.channel.send(new dc.MessageEmbed()
.setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
.setDescription(`Bu komutu kullanmak için <@&${settings.roller.botcommand}> yetkisine sahip olmalısın.`)
.setColor(settings.renk.shisiyah))

let uye = message.mentions.users.first() || message.author;
let bilgi = db.get(`yetkili.${uye.id}.toplam`);
let yazı = "İlk 10 kayıt top listesi"
  
let top = message.guild.members.cache.filter(uye => db.get(`yetkili.${uye.id}.toplam`)).array().sort((uye1, uye2) => Number(db.get(`yetkili.${uye2.id}.toplam`))-Number(db.get(`yetkili.${uye1.id}.toplam`))).slice(0, 15).map((uye, index) => (index+1)+" • <@"+ uye +">  ** • \`" + db.get(`yetkili.${uye.id}.toplam`) +"\` ** Kayıta Sahip.").join('\n');
message.channel.send(new dc.MessageEmbed().setAuthor(yazı, message.guild.iconURL({dynamic: true})).setDescription(top));
  
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["topteyit", "top", "teyit", "top-teyit"],
    permLevel: 0
};

exports.help = {
    name: "topteyit"
}