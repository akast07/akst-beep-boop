//---------global--------------
let dotenv = require('dotenv').config();
const fs = require('fs');
let path = require('path');
let logger = require('winston');
const Discord = require('discord.js');
//-----gooogle dialog
let dialogflow = require('dialogflow').v2beta1;
//------random 32byte hash
const uuid = require('uuid');
const sessionId = uuid.v4();
//----webapp-------
let express = require('express');
let app = express();
let keepAlive = require("node-keepalive");
//let redClient = require('redis').createClient(process.env.REDIS_URL);

//----------synth midi to wav-----
const synth = require('synth-js');
//-------------------------------------------------------------------
app.use(express.static(__dirname, { dotfiles: 'allow' } ));

//----------server settings ------------------

//---------initialize bot----------
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
    if (messageText == null) return; //empty queries

    //---bot check----
    if (message.author.bot) {
        return;
    }
    if (message.author.id === client.user.id) {
        return;
    }

    //if help show options

    //read message, post response
    if (message.content.indexOf('?') === 0) {
        //music parse or e.g. ??(bpm=95(4/4)Ebmaj7/2 - Dbsus9/2 -Bmaj7/4)
        if ((message.content.indexOf('?') === 1) && (message.content.indexOf('(') === 2)) {
            //breakdown the rest of the musical string
            let bpm;
            let timeSignature;
            let intervalDescription;

            //-------melody test ----------
            //midi2Wave(midiFile);

        }
        else {
            //dailogflow query
            runSample(messageText).then((res) => {
                console.log(res);
                let exampleEmbed = populateEmbed(res);
                message.channel.send(exampleEmbed);
            });
        }
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
    
    return result;

    if (result.intent) {
        //message.channel.send(`  Intent: ${result.intent.displayName}`);
    } else {
        //message.channel.send(`  No intent matched.`);
    }
};

    //---------embed population
function populateEmbed(result){
        console.log(''+result+'');
        //----------embedding formatting
        // inside a command, event listener, etc.
        //------color,title,url,author,description,thumbnail,addfield,setThumbnail, addfield, addblankfield,add infield field, setimage, setimestamp, set footer-------------
        let exampleEmbed = new Discord.RichEmbed()
        .setColor('#00ffaa')
        .setTitle(`${result.fulfillmentText}`)
        //.setURL('https://discord.js.org/')
        //.setAuthor(`${result.}`, 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
        .setDescription(`question : ${result.queryText}`)
        //.setThumbnail('https://i.imgur.com/wSTFkRM.png')
        //.addField('Regular field title', 'Some value here')
        //.addBlankField()
        //.addField('DIALOG RESPONSE :', , true)
        //.addField('INTENT : ',`${result.intent.displayName}`, true)
        //.addField('Inline field title', 'Some value here', true)
        //.setImage('https://i.imgur.com/wSTFkRM.png')
        //.attachFile()
        .setTimestamp();
        //.setFooter('2020', 'https://i.imgur.com/wSTFkRM.png');

        return exampleEmbed;
}

//-------- music----------
let midi2Wave = (midiFile) =>{

    let midiBuffer = fs.readFileSync(midiFile);
    let wavBuffer = synth.midiToWav(midiBuffer).toBuffer();    // convert midi buffer to wav buffer

    //instead of writing locally write to the db
    fs.writeFileSync(path.basename+".wav", wavBuffer, {encoding: 'binary'});
}

//parse message text to Chord progression
let textParseChord = () =>{
}

//------webpage----------
let port = process.env.PORT || '0.0.0.0';
app.set('port',port);

console.log(process.env.PORT);
console.log(port);

app.get('/',(req,res)=>{
    console.log("app is running");
    res.sendFile(path.join(__dirname + '/index.html'));

}).listen(app.get('port'),function(){
    console.log("%c Server running", "color: green");
    console.log('app is running server is listening on port',app.get('port'))
});

keepAlive({
    time:90, //in minutes?
    callback: function(error, response, body) {
        console.log('still alive');
      }
},app);
