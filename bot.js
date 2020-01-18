let dotenv = require('dotenv').config();
let logger = require('winston');
const Discord = require('discord.js');
//-----gooogle dialog
let dialogflow = require('dialogflow').v2beta1;
//------random 32byte hash
const uuid = require('uuid');
const sessionId = uuid.v4();
//----webapp
let express = require('express');
let app = express();
let keepAlive = require("node-keepalive");
let redClient = require('redis').createClient(process.env.REDIS_URL);

app.use(express.static(__dirname, { dotfiles: 'allow' } ));

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

//------discord channel properties 
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

client.on('message', message => {
    let messageText = message.content.substring(1);
    if(messageText == null) return; //empty queries

    //robots dont talk to themselves
    if(message.author.bot){
        return;
    }
    if(message.author.id === client.user.id){
        return;
    } 

    //read message, post response
    if(message.content.indexOf('?') === 0){
        //all text flow currently goes through runSample
        //dailogflow query
        runSample(messageText);
    }
});

//-----discord login
const TOKEN = process.env.TOKEN;
client.login(TOKEN).catch((err) =>{
    console.log(err);
});

//--------dialogflow reqres
async function runSample(messageText){
    let config ={
        credentials:{
            private_key: process.env.PRIVATE_KEY,
            client_email: process.env.CLIENT_EMAIL
        }
    };
    const sessionClient = new dialogflow.SessionsClient(config);
    const sessionPath = sessionClient.sessionPath(process.env.ProjectId, sessionId);
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

    //-->>message.channel.send(`${result.fulfillmentText}`);
    
    //populate embed
    let exampleEmbed = populateEmbed(result);
    channel.send(exampleEmbed);

    if (result.intent) {
        //message.channel.send(`  Intent: ${result.intent.displayName}`);
    } else {
        //message.channel.send(`  No intent matched.`);
    }
};

    //---------embed population
    function populateEmbed(result){
        //----------embedding formatting
        // inside a command, event listener, etc.
        //------color,title,url,author,description,thumbnail,addfield,setThumbnail, addfield, addblankfield,add infield field, setimage, setimestamp, set footer-------------
        let exampleEmbed = new Discord.RichEmbed()
        .setColor('#0099ff')
        .setTitle('Some title')
        .setURL('https://discord.js.org/')
        .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
        .setDescription('Some description here')
        .setThumbnail('https://i.imgur.com/wSTFkRM.png')
        .addField('Regular field title', 'Some value here')
        .addBlankField()
        .addField('Inline field title', 'Some value here', true)
        .addField('Inline field title', 'Some value here', true)
        .addField('Inline field title', 'Some value here', true)
        .setImage('https://i.imgur.com/wSTFkRM.png')
        .setTimestamp()
        .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

        return exampleEmbed;
    }

//--------magenta music ; webpage until widget
/*
const model = require('@magenta/music/node/music_vae');
const core = require('@magenta/music/node/core');
 
// These hacks below are needed because the library uses performance and fetch which
// exist in browsers but not in node. We are working on simplifying this!
const globalAny:any = global;
globalAny.performance = Date;
globalAny.fetch = require('node-fetch');
 
// Your code:
const model = new mode.MusicVAE('/path/to/checkpoint');
const player = new core.Player();
model
  .initialize()
  .then(() => model.sample(1))
  .then(samples => {
    player.resumeContext();
    player.start(samples[0])
  });
*/
app.get('/',(req,res)=>{
    res.sendFile('google11b051fd7dcd2c7e.html',{root:__dirname});
});

let port = process.env.PORT || '0.0.0.0';
app.set('PORT',port);

console.log(process.env.PORT);
console.log(port);

app.listen(port, (err) => {
    console.log("%c Server running", "color: green");
    console.log(`Our app is running on port ${ port } or `);
    if(err) throw err;
});

keepAlive({
    time:30,
    callback: function(error, response, body) {
        console.log('still alive');
      }
},app);
