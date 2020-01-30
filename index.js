// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const animals=require('./animals.json');
//const fruits=require('./fruits.json');
const QuizLogic=require('./QuizLogic');
const QuizModel=require('./QuizModel');
var constants= require("./Constants.js");
//var helpers = require("./helper");
var score=0;
var words_answered=[];
var last_word="";
var category="";
var speakOutput="";

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        
        speakOutput = 'Welcome to word antakshari ! you will have to say name of object starting with ending letter of last word . Are you ready ?';
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
      
        if(!sessionAttributes.last_word)
        {   sessionAttributes.last_word=last_word;
        }
        if(!sessionAttributes.score)
        {   sessionAttributes.score=score;
        }
        if(!sessionAttributes.user_slot)
        {   var user_slot="";
        }
        
        function GetFirstWord()
        {
            var first_word_array=[];
            first_word_array=animals.filter(x => x.start.toLowerCase().trim() === "a");
            //fetch random words
            var first_word=QuizLogic.QuizLogic.getRandomElement(first_word_array[0].words);
            sessionAttributes.last_word=first_word;
            sessionAttributes.words_answered.push(first_word);
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            return first_word;
        }
        
        //start of the game flow, alexa answering the first word
        if(!sessionAttributes.words_answered)
        {
            sessionAttributes.words_answered=words_answered;
            var first_word=GetFirstWord();
            return handlerInput.responseBuilder
            .speak("so lets get started! the first word is "+first_word)
            .reprompt(QuizLogic.QuizLogic.getRandomElement(constants.Constants.REPROMT_MESSAGE1)+QuizLogic.QuizLogic.getRandomElement(constants.Constants.REPROMT_MESSAGE2)+ first_word[first_word.length-1])
            .getResponse();
        }
        
        var animals_slot=handlerInput.requestEnvelope.request.intent.slots.animals_and_birds.value;
        sessionAttributes.user_slot=animals_slot;
        //resolutions.resolutionsPerAuthority[0].values[0].value.name;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        console.log("7");
        
        
        
        /*-------------------------------------
        //replay quiz - if user want to play the quiz again
        */
        
        //quiz replay-if user wants to continue the quiz
             
        if (QuizLogic.QuizLogic.IsQuizEnded(sessionAttributes)) {
            if (sessionAttributes.user_slot === constants.Constants.YES) {
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                var flag = constants.Constants.FALSE;
                sessionAttributes.Checking = constants.Constants.FALSE;
                var say="lets play the game again! the first word is "+ GetFirstWord();
                return handlerInput.responseBuilder
                .speak(say)
                .reprompt(say)
                .getResponse();
                    }
                    
            //if user doesn'y wants to play the quiz again
            else if (sessionAttributes.user_slot=== constants.Constants.NO) {
                flag = constants.Constants.FALSE;
                say="nice playing with you! see you again!";
                return handlerInput.responseBuilder
                .speak(say)
                .withShouldEndSession(constants.Constants.TRUE)
                .getResponse();
                    }
            else if (sessionAttributes.Checking) {
                say = constants.Constants.YES_OR_NO_MSG;
                return handlerInput.responseBuilder
                 .speak(say)
                 .reprompt(say)
                 .getResponse();
                    }
                }
      
      
        //to check if user has asked to skip
        if(animals_slot==="skip")
        {
            const next_letter = animals.filter(x => x.start.toLowerCase().trim() === sessionAttributes.last_word[sessionAttributes.last_word.length-1]);
            var next_animal= QuizLogic.QuizLogic.getRandomElement(next_letter[0].words);
            while(sessionAttributes.words_answered.includes(next_animal.toLowerCase()))
            {
                next_animal= QuizLogic.QuizLogic.getRandomElement(next_letter[0].words);
            }
            speakOutput = next_animal;
            sessionAttributes.last_word=next_animal;
            sessionAttributes.words_answered.push(next_animal.toLowerCase());
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            return handlerInput.responseBuilder
                .speak(QuizLogic.QuizLogic.getRandomElement(constants.Constants.SKIP_PROMPTS) +next_animal)
                .reprompt(QuizLogic.QuizLogic.getRandomElement(constants.Constants.REPROMT_MESSAGE1)+QuizLogic.QuizLogic.getRandomElement(constants.Constants.REPROMT_MESSAGE2) +next_animal[next_animal.length-1])
                .getResponse();
           
        }
        
        console.log("9");
       
        //checking if user answer is in our list of valid animals and birds
        var check_element= animals.filter(x => x.start.toLowerCase().trim() === animals_slot[0]);
        console.log("10");
        if(!check_element[0].words.includes(animals_slot.toLowerCase()))
        {   
            console.log("11");
            console.log(animals_slot+" is not valid");
            return handlerInput.responseBuilder
            .speak("this is not a valid animal or bird! ")
            .reprompt(QuizLogic.QuizLogic.getRandomElement(constants.Constants.REPROMT_MESSAGE1)+QuizLogic.QuizLogic.getRandomElement(constants.Constants.REPROMT_MESSAGE2)+ sessionAttributes.last_word[sessionAttributes.last_word.length-1])
            .getResponse();
        }
        
        //to check if the word has already been used in the game
        if(QuizLogic.QuizLogic.IsDuplicate(sessionAttributes))
        {
            console.log("11b");
            console.log("duplicate");
            return handlerInput.responseBuilder
            .speak("this word has been used! come up with something new")
            .reprompt('no cheating haaa , now start with '+ sessionAttributes.last_word[sessionAttributes.last_word.length-1])
            .getResponse();
        }
        
        
        //initializing life lifelines
        if(!sessionAttributes.lifelines)
        {
            sessionAttributes.lifelines=3;
        }
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        
         //to validate that user says word starting with last letter of previous word
        console.log("8");
        if(sessionAttributes.words_answered.length>1)
        {   console.log("8a");
            if(!QuizLogic.QuizLogic.AnswerValidation(sessionAttributes))
            {console.log("8b");
            speakOutput ="ooppsss....your word does not start with "+sessionAttributes.last_word[sessionAttributes.last_word.length-1]+" . "+QuizLogic.QuizLogic.ssml(constants.Constants.BREAK,"2s")+ ` you are left with ${sessionAttributes.lifelines-1}  lifelines . ` ;
            sessionAttributes.lifelines=sessionAttributes.lifelines-1;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            
            //if lifelines are finished , end the game and declare scores. ask if user wants to replay the game
             if(sessionAttributes.lifelines===0)
            {
                return handlerInput.responseBuilder
                .speak(speakOutput+QuizLogic.QuizLogic.ssml(constants.Constants.EMPHASIS,"moderate",constants.Constants.RESULT_MESSAGE)+sessionAttributes.score+QuizLogic.QuizLogic.ssml(constants.Constants.BREAK,"2s")+constants.Constants.END_MESSAGE + "would you like to play again? ")
                .reprompt('would you like to play again? ')
                //.withShouldEndSession(true)
                .getResponse();
            }
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(QuizLogic.QuizLogic.getRandomElement(constants.Constants.REPROMT_MESSAGE1)+QuizLogic.QuizLogic.getRandomElement(constants.Constants.REPROMT_MESSAGE2)+ sessionAttributes.last_word[sessionAttributes.last_word.length-1])
            .getResponse();
            
            }
          console.log("8c");
        }
        
        console.log("12");
        sessionAttributes.words_answered.push(animals_slot.toLowerCase());
        sessionAttributes.score+=10;
        
        //alexa saying next word
        const next_letter = animals.filter(x => x.start.toLowerCase().trim() === animals_slot[animals_slot.length-1]);
        next_animal= QuizLogic.QuizLogic.getRandomElement(next_letter[0].words);
        while(sessionAttributes.words_answered.includes(next_animal.toLowerCase()))
        {
            next_animal= QuizLogic.QuizLogic.getRandomElement(next_letter[0].words);
        }
        
        speakOutput = next_animal;
        sessionAttributes.last_word=next_animal;
        sessionAttributes.words_answered.push(next_animal.toLowerCase());
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(QuizLogic.QuizLogic.getRandomElement(constants.Constants.REPROMT_MESSAGE1)+QuizLogic.QuizLogic.getRandomElement(constants.Constants.REPROMT_MESSAGE2)+sessionAttributes.last_word[sessionAttributes.last_word.length-1])
            .getResponse();
    }
};



const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        speakOutput = 'you will have to answer a animal or bird whose name starts with last lette of previous word. for example, if i say cat, you have to say a creature starting with T . you will have three lifelines . for every correct anwser, you get a plus ten . ';

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
        speakOutput = 'it was nice playing with you ! Goodbye!';
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
        speakOutput = `You just triggered ${intentName}`;

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
        speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

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
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
