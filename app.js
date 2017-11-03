
var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users
server.post('/api/messages', connector.listen());


var ingredientsList = {
    "ethanol":
        {"fact" : "Kills germs/germ-killing agent. Trusted by generations as the gold standard."
        },
    "water":{
        "fact" : "Dilutent or solvent - responsible for diluting the other ingredients.If it's not disolved - it will be separated (e.g. oil and water separated).  Because ingredients are dissolved evenly, no matter what part of the wipe you use, you get the same performance."
    },
    "butane":{
        "fact" : "Helps evacuate the product into a fine mist for maximum spray. Engine to release the product."
    },
    "borate":{
        "fact" : "Stops the can from rusting (inside), which could cause a pinhole/leak. Stops residue build-up."
    },
    "parfum":{
        "fact" : "Imparts pleasant odor."
    },
    "acid blue 145":{
        "fact" : "Dye is a colorant (dye or pigment) added to cleaning products to improve aesthetic appeal or to act as an idenfiter of where product was placed."
    },
    "glycolic acid":{
        "fact" : "Helps removing stains (like soap and limescale) with lower pH."
    },
    "sodium lauryl sulfate":{
        "fact" : "Helps water to pull dirt from the surface being cleaned."
    },
    "citric acid":{
        "fact" : "Uses a safer acid to kill germs."
    },
    "lauramine oxide":{
        "fact" : "Helps water to pull dirt from the surface being cleaned."
    },
    "sodium bicarbonate":{
        "fact" : "Keeps pH at optimal level to provide best performance in regards to bacteria kill.  The germ kill ingredient is more effective at killing bacteria at a higher pH."
    },
    "colorant":{
        "fact" : "Gives product distinctive color."
    }
}



// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.beginDialog('greatings', session);
       // session.send("Welcome to the Reckitt Benckiser Question Answear Applicaton. Please provide a ingredient name:");
       // builder.Prompts.text(session, "Please provide a ingredient name");
    },
    function (session, results) {
        session.dialogData.ingredient = results.response;
        var ingredient = session.dialogData.ingredient;
        if (!ingredientsList[ingredient]) {
            session.send("That's not a ingredient. Try asking about another ingredient.")
        } else {
            var fact = ingredientsList[ingredient].fact
            session.send("You choose: "+ingredient+". This is what I know about it: " + fact);
            session.endDialog();
        }



    }

]);

bot.dialog('greetings', [
    // Step 1
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    // Step 2
    function (session, results) {
        session.endDialog();
    }
]);

var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.beginDialog('greetings', session.userData.ingredient);
    },
    function (session, results) {
        session.beginDialog('nextStep', session.userData.ingredient);
       // session.userData.ingredient = results.response; // Save user profile.
       // session.send(`If you want to ask about another ingredient, please provide name`);
    }
]);
bot.dialog('greetings', [
    function (session, args, next) {
        session.dialogData.ingredient = args || undefined; // Set the profile or create the object.
        if (!session.dialogData.ingredient) {
            builder.Prompts.text(session, "Welcome to the Reckitt Benckiser Question Answear Applicaton. Please provide a ingredient name");
        } else {
            builder.Prompts.text(session, "Please provide a ingredient name")
           // next(); // Skip if we already have this info.
        }
    },
    function (session, results, next) {
        if (results.response) {
            // Save user's name if we asked for it.
            session.dialogData.ingredient = results.response;
          //  next(); // Skip if we already have this info.
           // session.endDialogWithResult({ response: session.dialogData.ingredient });
            var ingredient = session.dialogData.ingredient;
            if (!ingredientsList[ingredient]) {
                session.send("That's not a ingredient. Try asking about another ingredient.")
                next();
            } else {
                var fact = ingredientsList[ingredient].fact
                session.send("You choose: "+ingredient+". This is what I know about it: " + fact);
                session.endDialogWithResult({ response: session.dialogData.ingredient });
            }
        }
    }
]);

bot.dialog('nextStep', [
    function (session, args, next) {
        builder.Prompts.text(session, "Please provide another ingredient name")
    },
    function (session, results, next) {
        if (results.response) {
            // Save user's name if we asked for it.
            session.dialogData.ingredient = results.response;
            //  next(); // Skip if we already have this info.
            // session.endDialogWithResult({ response: session.dialogData.ingredient });
            var ingredient = session.dialogData.ingredient;
            if (!ingredientsList[ingredient]) {
                session.send("That's not a ingredient. Try asking about another ingredient.")
                next();
            } else {
                var fact = ingredientsList[ingredient].fact
                session.send("You choose: "+ingredient+". This is what I know about it: " + fact);
                session.endDialogWithResult({ response: session.dialogData.ingredient });
            }
        }
    }
]);