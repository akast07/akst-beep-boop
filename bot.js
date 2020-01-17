let dotenv = require('dotenv').config();
let logger = require('winston');
const Discord = require('discord.js');
let dialogflow = require('dialogflow').v2beta1;
const uuid = require('uuid');
const sessionId = uuid.v4();
let express = require('express');
let app = express();
//Dialogflow API Admin
//initialize bot
const client = new Discord.Client();
//logger settings 
// logger.remove(logger.transports.Console);
// logger.add(new logger.transports.Console(),{
//     colorize:true
// });
// logger.level = 'debug';
//dotenv check
if(dotenv.error){ throw result.error;}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });
client.on('message', message => {
    let messageText = message.content.substring(1);
    if(messageText == null) return;

    //robots dont talk to themselves
    if(message.author.bot){
        return;
    }
    if(message.author.id === client.user.id){
        return;
    } 

    //parse message
    if(message.content.indexOf('?') === 0){

        async function runSample(messageText){
            let config ={
                credentials:{
                    private_key: process.env.PRIVATE_KEY,
                    client_email: process.env.CLIENT_EMAIL
                }
            };
            const sessionClient = new dialogflow.SessionsClient(config);
            const sessionPath = sessionClient.sessionPath(process.env.PROJECTID, sessionId);
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
            //message.channel.send('intent detected');
            const result = dailogRes[0].queryResult;
            //message.channel.send(`  Query: ${result.queryText}`);
            message.channel.send(`${result.fulfillmentText}`);
            if (result.intent) {
                //message.channel.send(`  Intent: ${result.intent.displayName}`);
            } else {
                //message.channel.send(`  No intent matched.`);
            }
        };

                    //dailogflow setup
                    runSample(messageText);

                // case messageText == 'help':
                //     message.channel.send(' commands : help, ping, talk to the bot ai ');
                //     break;
                // case messageText == 'ping':
                //     message.channel.send('Pinging...').then((msg) => {
                //         msg.edit("Ping: " + (Date.now() - msg.createdTimestamp));
                //     });
                //     break;
                // case messageText == '?':
                //     //some ol' bull
                //     message.channel.send('You only need one question mark');
                //     break;
            }
});

const TOKEN = process.env.TOKEN;
console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);
client.login(TOKEN).catch((err) =>{
    console.log(err);
});

const PORT = process.env.PORT || 3000;
app.get('/',()=>{
    res.sendFile(`google11b051fd7dcd2c7e.html`);
});
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});