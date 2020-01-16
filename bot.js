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

console.log(bot);

bot.on('on_error',(evt) => {
    logger.info("-----Error time-----");
    logger.info(bot);
});

bot.on('login',(evt) => {
    console.log('inside login');
});

bot.on('ready', (evt) => {
    logger.info('**Connected**');
    logger.info('Logged in as: ');
    logger.info(bot.username+'-('+bot.id+')');
});

bot.on('message', (user, userID, channelID, message, evt) => {

    if (message.content != null) {
        
        if (message.member.voiceChannel) {
            const channel = message.member.voiceChannel;
            channel.join()
            .then(connection => console.log('Connected!'))
            .catch(console.error);
            }

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