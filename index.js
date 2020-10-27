const Discord = require("discord.js");
const config = require("./config.json");
const bot = new Discord.Client();
const express = require("express");

const app = express();
app.get("/", (request, response) => {
  const ping = new Date();
  ping.setHours(ping.getHours() - 3);
  console.log(`Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
  response.sendStatus(200);
});
app.listen(process.env.PORT); // Recebe solicitações que o deixa online


//inicio de tudo
bot.on('message', message => {
  if (message.author.bot) return;
  if (message.channel.type == 'channel') return;
  if (!message.content.toLowerCase().startsWith(config.prefix)) return;
  if (message.content.startsWith(`<@!${bot.user.id}>`) || message.content.startsWith(`<@${bot.user.id}>`)) return;

  const args = message.content
    .trim().slice(config.prefix.length)
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  try {
    const commandFile = require(`./commands/${command}.js`)//puxando a pasta comands + o comando
    commandFile.run(bot, message, args);
  } catch (err) {
    const embed = new Discord.MessageEmbed()
    .setColor('GREEN')
    .setDescription(`${message.author}, O comando informado nao existe ou ainda nao foi adcionado, se isso for um erro chame por <@434791887241740288> \nUtilize **.help** para saber meus comandos.`)
    return message.channel.send(embed);
  }
});

//status
bot.on('ready', () => {
  console.log('Estou online');
  var tabela = [
    { name: 'ultilize m!help para saber meus comandos (em breve)', type: 'PLAYING' },
    { name: 'ultilize m!help para saber meus comandos (em breve)', type: 'WATCHING' }
  ];

  function setStatus() {
    var altstatus = tabela[Math.floor(Math.random() * tabela.length)]
    bot.user.setActivity(altstatus)
  }
  setStatus("online")
  setInterval(() => setStatus(), 5000)
})

bot.login(config.token);
