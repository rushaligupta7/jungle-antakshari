// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const animals=require('./animals.json');
const fruits=require('./fruits.json');
const QuizLogic=require('./QuizLogic');
const QuizModel=require('./QuizModel');
var constants= require("./Constants.js");
//var helpers = require("./helper");
var score=0;
var words_answered=[];
var last_word="";
var category="";


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to word antakshari ! you will have to say name of object starting with ending letter of last word . choose one of the categories : animals and birds or fruits and vegetables ';
        //how many players are you there ? if you are one , i would love to be your partner ';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};




const AnimalsAndBirdsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AnimalsAndBirdsIntent';
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        /*-------------------------------------
        //replay quiz - if user want to play the quiz again
        
        
        -------------------------------------
        
        
        //if user doesnt wants to play the quiz again
        -------------------------------------*/
        
        var animals_slot=handlerInput.requestEnvelope.request.intent.slots.animals_and_birds.value;
        sessionAttributes.user_slot=animals_slot;
        console.log("7");
        
        
        if(!sessionAttributes.words_answered)
        {
            sessionAttributes.words_answered=words_answered;
        }
        if(!sessionAttributes.last_word)
        {
            sessionAttributes.last_word=last_word;
        }
        if(!sessionAttributes.score)
        {
            sessionAttributes.score=score;
        }
        //to validate that user says word starting with last letter of previous word
        console.log("8");
        if(sessionAttributes.words_answered.length>1)
        {console.log("8a");
            if(!QuizLogic.QuizLogic.AnswerValidation(sessionAttributes))
            {console.log("8b");
                return handlerInput.responseBuilder
            .speak("ooppsss....your word does not start with "+sessionAttributes.last_word[sessionAttributes.last_word.length-1]+" . "+QuizLogic.QuizLogic.ssml(constants.Constants.BREAK,"2s")+QuizLogic.QuizLogic.ssml(constants.Constants.EMPHASIS,"moderate",constants.Constants.RESULT_MESSAGE)+sessionAttributes.score+QuizLogic.QuizLogic.ssml(constants.Constants.BREAK,"2s")+constants.Constants.END_MESSAGE)
            
           //getRandomElement(constants.Constants.WRONG_RESPONSE)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .withShouldEndSession(true)
            .getResponse();
            }
            console.log("8c");
        }
        
        
        console.log("9");
       
        
        //console.log("last char of last word "+animals_slot[0]);
        var check_element= animals.filter(x => x.start.toLowerCase().trim() === animals_slot[0]);
        console.log("10");
        if(!check_element[0].words.includes(animals_slot.toLowerCase()))
        {console.log("11");
            console.log(animals_slot+" is not valid");
            return handlerInput.responseBuilder
            .speak("this is not a valid animal or bird! ")
            .reprompt('go ahead! find the correct one')
            .getResponse();
        }
        
        //to check if the word has already been used in the game
        if(QuizLogic.QuizLogic.IsDuplicate(sessionAttributes))
        {console.log("11b");
            console.log("duplicate");
            return handlerInput.responseBuilder
            .speak("this word has been used! come up with something new")
            .reprompt('no cheating haaa')
            .getResponse();
        }
        
        console.log("12");
        sessionAttributes.words_answered.push(animals_slot.toLowerCase());
        sessionAttributes.score+=10;
        
        
        //alexa saying next word
        const next_letter = animals.filter(x => x.start.toLowerCase().trim() === animals_slot[animals_slot.length-1]);
        
        var next_animal= QuizLogic.QuizLogic.getRandomElement(next_letter[0].words);
        while(sessionAttributes.words_answered.includes(next_animal.toLowerCase()))
        {
            next_animal= QuizLogic.QuizLogic.getRandomElement(next_letter[0].words);
        }
        
        const speakOutput = next_animal;
        sessionAttributes.last_word=next_animal;
        sessionAttributes.words_answered.push(next_animal.toLowerCase());
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('come on come on')
            .getResponse();
    }
};

const FruitsAndVegetablesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FruitsAndVegetablesIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CategoryIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CategoryIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'lets get started';
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        
       
        
        
        if(!sessionAttributes.category)
        {
            sessionAttributes.category=category;
        }
        if(!sessionAttributes.words_answered)
        {
            sessionAttributes.words_answered=words_answered;
        }
        sessionAttributes.category=handlerInput.requestEnvelope.request.intent.slots.category.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        //handlerInput.requestEnvelope.request.intent.slots.category.value;
        
        
        
         var first_word_array=[];
           if(sessionAttributes.category==="animal")
            {first_word_array=animals.filter(x => x.start.toLowerCase().trim() === "a");
            }
            else if(sessionAttributes.category==="fruit")
            {
             first_word_array=fruits.filter(x => x.start.toLowerCase().trim() === "a");
            }
            
            //fetch random words
                var first_word=QuizLogic.QuizLogic.getRandomElement(first_word_array[0].words);
                    sessionAttributes.last_word=first_word;
                 //sessionAttributes.words_answered.push(first_word);
                 handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    
        
       
            
        
        return handlerInput.responseBuilder
           .speak("so lets get started! the first word is "+first_word)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'it was nice playing with you ! Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        AnimalsAndBirdsIntentHandler,
        FruitsAndVegetablesIntentHandler,
        CategoryIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
