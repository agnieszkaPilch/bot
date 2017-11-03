var Promise = require('bluebird');

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


module.exports = {
    searchIngredients: function (ingredient) {
        return new Promise(function (resolve) {

            // Filling the hotels results manually just for demo purposes
            var fact = ingredientsList[ingredient];

            // complete promise with a timer to simulate async response
            setTimeout(function () { resolve(fact); }, 1000);
        });
    }
};