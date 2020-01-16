let dotenv = require('dotenv').config();
let logger = require('winston');
let auth = require('./auth.json');
const Discord = require('discord.js');
//initialize bot
const client = new Discord.Client();

//logger settings 
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(),{
    colorize:true
});
logger.level = 'debug';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });
  
  client.on('message', msg => {
    if (msg.content === 'ping') {
      msg.reply('pong');
    }
  });
  
  client.login(process.env.token);