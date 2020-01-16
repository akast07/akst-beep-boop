let dotenv = require('dotenv').config();
let logger = require('winston');
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
  
client.on('message', message => {
    if (message.content === 'ping') {
        message.channel.send('Pinging...').then((msg)=>{
            msg.edit("Ping: " + (Date.now() - msg.createdTimestamp));
        });
    }
});

client.login(process.env.token);