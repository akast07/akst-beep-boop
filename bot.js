let dotenv = require('dotenv').config();
let logger = require('winston');
const Discord = require('discord.js');
let dialogflow = require('dialogflow').v2beta1;
const botID = process.env.BOTID;
const uuid = require('uuid');
const sessionId = uuid.v4();

//initialize bot
const client = new Discord.Client();
//logger settings 
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(),{
    colorize:true
});
logger.level = 'debug';
//dotenv check
if(dotenv.error){ throw result.error;}


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });
client.on('message', message => {

    //robots dont talk to themselves
    if(message.author.bot) return;

    let messageText = message.content.substring(1);
    //parse message
    switch(message.content.indexOf('?') === 0){
        case messageText == 'help':
            message.channel.send(' commands : help, ping, talk to the bot ai ');
            break;
        case messageText == 'ping':
            message.channel.send('Pinging...').then((msg)=>{
            message.edit("Ping: " + (Date.now() - msg.createdTimestamp));
            }).catch((err)=>{
                message.channel.send('------errors here:----- \n'+err);
            });
            break;
        case messageText == '?':
            //some ol' bull
            message.channel.send('You only need one question mark');
            break;
        default:
            //dailogflow setup
        async function runSample(projectid = process.env.projectid){
            const sessionClient = new dialogflow.SessionsClient();
            const sessionPath = sessionClient.sesionPath(projectid,sessionId);

                // The text query request.
                const dialogFlowReq = {
                    session: sessionPath,
                    queryInput: {
                        text: {
                            // The query to send to the dialogflow agent
                            text: messageText,
                            // The language used by the client (en-US)
                            languageCode: 'en-US',
                        },
                    },
                };
            
            const dailogRes = await sessionClient.detectIntent(dialogFlowReq);
            message.channel.send('intent detected');
            const result = dailogRes[0].queryResult;
            message.channel.send(`  Query: ${result.queryText}`);
            message.channel.send(`  Response: ${result.fulfillmentText}`);
            if (result.intent) {
            message.channel.send(`  Intent: ${result.intent.displayName}`);
            } else {
            message.channel.send(`  No intent matched.`);
            }
            };
            break;
    }
});
const TOKEN = process.env.TOKEN;

client.login(TOKEN).catch((err) =>{
    console.log(err);
});