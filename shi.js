const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const moment = require('moment');
var Jimp = require('jimp');
const { Client, Util } = require('discord.js');
const fs = require('fs');
const db = require('quick.db');
const express = require('express');
require('./util/eventLoader.js')(client);
const path = require('path');
const snekfetch = require('snekfetch');
const settings = require('./shi/settings.json')
var prefix = ayarlar.prefix;

const log = message => {console.log(`${message}`);};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
if (err) console.error(err);
log(`shi ${files.length}`);
files.forEach(f => {
let props = require(`./komutlar/${f}`);
log(`BOT | ${props.help.name} Komutu Yüklendi.`);
client.commands.set(props.help.name, props);
props.conf.aliases.forEach(alias => {client.aliases.set(alias, props.help.name);});});});

client.reload = command => {return new Promise((resolve, reject) => {try {delete require.cache[require.resolve(`./komutlar/${command}`)];
let cmd = require(`./komutlar/${command}`);
client.commands.delete(command);
client.aliases.forEach((cmd, alias) => {if (cmd === command) client.aliases.delete(alias);});
client.commands.set(command, cmd);
cmd.conf.aliases.forEach(alias => {client.aliases.set(alias, cmd.help.name);});resolve();} catch (e) {reject(e);}});};

client.load = command => {return new Promise((resolve, reject) => {try {let cmd = require(`./komutlar/${command}`);
client.commands.set(command, cmd);
cmd.conf.aliases.forEach(alias => {client.aliases.set(alias, cmd.help.name);});resolve();} catch (e) {reject(e);}});};

client.unload = command => { return new Promise((resolve, reject) => { try {delete require.cache[require.resolve(`./komutlar/${command}`)];
let cmd = require(`./komutlar/${command}`);
client.commands.delete(command);
client.aliases.forEach((cmd, alias) => {if (cmd === command) client.aliases.delete(alias);});resolve();} catch (e) {reject(e);}});};

client.on("ready", async () => {
  let botVoiceChannel = client.channels.cache.get(ayarlar.botVoiceChannelID);
  if (botVoiceChannel) botVoiceChannel.join().catch(err => console.error("Bot ses kanalına bağlanamadı!"));
});

client.elevation = message => {
if (!message.guild) {return;}
let permlvl = 0;
if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
if (message.author.id === ayarlar.sahip) permlvl = 4; return permlvl;};
var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
client.on('warn', e => {console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));});
client.on('error', e => {console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));});
client.login(ayarlar.token);

client.on("guildMemberAdd", member => {
  member.roles.add(settings.roller.kayıtsızrol)
  member.roles.add(settings.roller.kayıtsızrol)
  member.roles.add(settings.roller.kayıtsızrol)
  member.roles.add(settings.roller.kayıtsızrol)
})
 
 
//-------------------------------taglog--------------------------------------//

client.on("userUpdate", async (shi, yeni) => {
  var sunucu = client.guilds.cache.get(settings.kanallar.guildid);
  var uye = sunucu.members.cache.get(yeni.id);
  var tag = (settings.taglar.servertag);
  var tagrol = (settings.roller.ekiprol);
  var logKanali = (settings.kanallar.taglog); 
  if (!sunucu.members.cache.has(yeni.id) || yeni.bot || shi.username === yeni.username) return;
  
  if ((yeni.username).includes(tag) && !uye.roles.cache.has(tagrol)) {
    try {
      await uye.roles.add(tagrol);
      await uye.send(`Tagımızı aldı.`);
      await client.channels.cache.get(logKanali).send(new Discord.MessageEmbed().setColor(settings.renk.shisiyah).setDescription(`${yeni} adlı üye tagımızı alarak aramıza katıldı!`));
    } catch (err) { console.error(err) };
  };
  
  if (!(yeni.username).includes(tag) && uye.roles.cache.has(tagrol)) {
    try {
      await uye.roles.remove(uye.roles.cache.filter(rol => rol.position >= sunucu.roles.cache.get(tagrol).position));
      await uye.send(`Tagımızı bıraktığın için ekip rolü ve yetkili rollerin alındı! Tagımızı tekrar alıp aramıza katılmak istersen;\nTagımız: **${tag}**`);
      await client.channels.cache.get(logKanali).send(new Discord.MessageEmbed().setColor(settings.renk.shisiyah).setDescription(`${yeni} adlı üye tagımızı bırakarak aramızdan ayrıldı!`));
    } catch(err) { console.error(err) };
  };
});

//-------------------------------taglog--------------------------------------//
client.on("guildMemberAdd", member => {
  let sunucuid = (settings.kanallar.sunucuid);
  let tag = (settings.taglar.servertag);
  let rol = (settings.roller.ekiprol); 
if(member.user.username.includes(tag)){
member.roles.add(rol)
  const tagalma = new Discord.MessageEmbed()
      .setColor(settings.renk.shisiyah)
      .setDescription(`<@${member.id}> adlı kişi sunucumuza taglı şekilde katıldı, o doğuştan beri bizden !`)
      .setTimestamp()
     client.channels.cache.get(settings.kanallar.taglog).send(tagalma)
}
})
///////////////////////////////////////////////hoşgeldin
client.on("guildMemberAdd", member => {  
  const kanal = member.guild.channels.cache.find(r => r.id === (settings.kanallar.hgkanal));
    
    let user = client.users.cache.get(member.id);
    require("moment-duration-format");
      const kurulus = new Date().getTime() - user.createdAt.getTime();  
  const gecen = moment.duration(kurulus).format(`YY **[Yıl,]** DD **[Gün,]** HH **[Saat,]** mm **[Dakika,]** ss **[Saniye]**`) 
   
    var kontrol;
  if (kurulus < 1296000000) kontrol = (settings.durumlar.yanlis)
  if (kurulus > 1296000000) kontrol = (settings.durumlar.dogru)
  moment.locale("tr");
  kanal.send("**:tada::tada::tada:Sunucumuza Hoş Geldin ! <@" + member + ">\n\nHesabın "+ gecen +" önce oluşturulmuş "+ kontrol +"\n\n<@&821101428420116490> Rolündeki kişiler seninle ilgilenecektir.\n\nTagımızı alarak bize destek olabilirsin.(\`♢\`)\n\nSunucuya kayıt olmadan önce kurallara göz atmayı unutma. <#820996409624363009>\n\nSeninle birlikte \`" + member.guild.memberCount + "\` kişi olduk.:tada:**")
  });

  ///////////////////////yasaklıtag
  client.on("guildMemberAdd", member => {

    if(member.user.username.includes("*/*/*/*/*/*/*/*/")){
    member.roles.add(settings.roller.yasaklıtag)
    member.roles.add(settings.roller.yasaklıtag)
    member.roles.add(settings.roller.yasaklıtag)
    member.roles.remove(settings.roller.kayıtsızrol)
    member.roles.remove(settings.roller.kayıtsızrol)
    member.roles.remove(settings.roller.kayıtsızrol)
    member.send("**__Sunucumuzun Yasaklı Tagında Bulunuyorsunuz, Şüpheli Kısmına Atıldınız.__**")
    }
    })
 
    /////////////////////şüpheli hesap
    client.on("guildMemberAdd", async member => {
      let kişi= client.users.cache.get(member.id);
      const tarih = new Date().getTime() - kişi.createdAt.getTime();   

    if (tarih < 1296000000) {
    member.roles.add(settings.roller.şüphelihesap)
    member.roles.add(settings.roller.şüphelihesap)
    member.roles.add(settings.roller.şüphelihesap)
    member.roles.remove(settings.roller.kayıtsızrol)
    member.roles.remove(settings.roller.kayıtsızrol)
    member.roles.remove(settings.roller.kayıtsızrol)
    member.user.send('Hesabın yeni açıldığı için cezalıya atıldın bi sorun olduğunu düşünüyorsan yetkililere ulaşabilirsin.')
  
    
      }
});

