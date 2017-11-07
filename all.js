// This loads the environment variables from the .env file
require('dotenv-extended').load();
var stringify = require('json-stringify-safe');
var builder = require('botbuilder');
var restify = require('restify');
var Store = require('./Store');
var spellService = require('./spell-service');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 443, function () {
    console.log('%s listening to %s', server.name, server.url);
});
// Create connector and listen for messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, function (session) {
    console.log(session.message)
    if(session.message.text) {
        session.send('Sorry, I did not understand \'%s\'. Type for example "check ethanol".', session.message.text);
    } else{
        session.send("Welcome to the Reckitt Benckiser Question Answear Applicaton. To ask about ingredient type for example \"check ethanol\"");
    }
});
bot.on('conversationUpdate', function (message) {
    console.log(message)
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                bot.beginDialog(message.address, '/');
            }
        });
    }
});


var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);


bot.dialog('ingredient', [
    function (session, args, next) {
        var ingredientName;
        if(args.intent){
            ingredientName = builder.EntityRecognizer.findEntity(args.intent.entities, 'Ingr');
        }
        console.log(JSON.stringify(stringify(args)))
         if (ingredientName) {
            session.dialogData.searchType = 'airport';
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

bot.dialog('Hi', function (session) {
    session.endDialog('Hi! Try asking me things like \'search hotels in Seattle\', \'search hotels near LAX airport\' or \'show me the reviews of The Bot Resort\'');
}).triggerAction({
    matches: 'Hi'
})
