let Discord = require('discord.io');
let logger = require('winston');
let auth = require('./auth.json');

//logger settings 
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(),{
    colorize:true
});
logger.level = 'debug';


//initialize bot
let bot = new Discord.Client({
    token:auth.token,
    autorun:true
});

bot.on('ready', function(evt){
    logger.info('**Connected**');
    logger.info('Logged in as: ');
    logger.info(bot.username+'-('+bot.id+')');
});

bot.on('message', function (user, userID, channelID, message, evt) {

    if (message.content != null) {
        
        switch(message) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
                case 'pong':
                    bot.sendMessage({
                        to: channelID,
                        message: 'ping!'
                    });
            break;
            // Just add any case commands if you want to..
         }
     }
});