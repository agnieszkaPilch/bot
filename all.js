// Reference the packages we require so that we can use them in creating the bot
var restify = require('restify');
var builder = require('botbuilder');
var Store = require('./Store');
var stringify = require('json-stringify-safe');
// =========================================================
// Bot Setup
// =========================================================
// Setup Restify Server
// Listen for any activity on port 3978 of our local server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
 console.log('%s listening to %s', server.name, server.url);
});
// Create chat bot
var connector = new builder.ChatConnector({
 appId: process.env.MICROSOFT_APP_ID,
 appPassword: process.env.MICROSOFT_APP_PASSWORD
});
//var bot = new builder.UniversalBot(connector);

var bot = new builder.UniversalBot(connector, function (session) {
    if(session.message.text && session.message.text!=="USER_DEFINED_PAYLOAD") {
        session.send('Sorry, I did not understand \'%s\'. Type for example "check ethanol".', session.message.text);
    } else{
        session.send("Welcome to the Reckitt Benckiser Question Answear Applicaton. To ask about ingredient type for example \"check ethanol\"");
    }
});
var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);


//var bot = new builder.UniversalBot(connector, function (session) {
//    console.log(session.message)
   // if(session.message.text) {
   //     session.send('Sorry, I did not understand \'%s\'. Type for example "check ethanol".', session.message.text);
  //  } else{
  //      session.send("Welcome to the Reckitt Benckiser Question Answear Applicaton. To ask about ingredient type for example \"check ethanol\"");
  //  }
//});


// If a Post request is made to /api/messages on port 3978 of our local server, then we pass it to the bot connector to handle
server.post('/api/messages', connector.listen());

bot.on('conversationUpdate', function (message) {    
    console.log('convesationUpdate Address : ' + JSON.stringify(message.address)); 
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
               bot.beginDialog(message.address, '/');
            }
        });
    }
});

// =========================================================
// Bots Dialogs 
// =========================================================
// This is called the root dialog. It is the first point of entry for any message the bot receives
//bot.dialog('/', function (session) {
// Send 'hello world' to the user
 // if(session.message.text) {
 //       session.send('Sorry, I did not understand \'%s\'. Type for example "check ethanol".', session.message.text);
 //   } else{
  //      session.send("Welcome to the Reckitt Benckiser Question Answear Applicaton. To ask about ingredient type for example \"check ethanol\"");
  //  }
//});

bot.dialog('ingredient', [
    function (session, args, next) {
        var ingredientName;
        if(args.intent){
            ingredientName = builder.EntityRecognizer.findEntity(args.intent.entities, 'Ingr');
        }
      
         if (ingredientName) {
            session.dialogData.searchType = 'ingredientName';
            next({ response: ingredientName.entity });
        } else {
            builder.Prompts.text(session, 'Please enter ingredient name');
        }
    },
    function (session, results) {
        var ingredient = results.response;
        // Async search
        Store
            .searchIngredients(ingredient)
            .then(function (res) {
                // args
                if (!res) {
                    session.send("That's not a ingredient. Try asking about another ingredient.")
                } else {
                    session.send("This is what I know about it: " + res.fact);
                }

                // End
                session.endDialog();
            });
    }
]).triggerAction({
    matches: 'ingredient'

});
