const Alexa = require('ask-sdk-core');
const animals=require('./animals.json');
const QuizLogic=require('./QuizLogic');
var constants= require("./Constants.js");
const helper = require('./Helper');
const bt7 = require('./ScoreTemplateData.json');
const persistenceAdapter = require('ask-sdk-s3-persistence-adapter');
const bt8=require('./gameData.json');
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
        
        speakOutput = 'Welcome to jungle antakshari ! you will have to say name of an animal or bird , starting with , last letter , of last word . For every correct answer, you grab 10 points. Are you ready to start ?';
        if (helper.Helper.supportsAPL(handlerInput))
        {
            handlerInput.responseBuilder
            .addDirective({
   type: 'Alexa.Presentation.APL.RenderDocument',
   document: require('./WelcomeTemplate.json'),
  datasources: require('./WelcomeTemplateData.json'),
 });
        }
        
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
    async handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        const attributesManager = handlerInput.attributesManager;
        if(!sessionAttributes.last_word)
        {   sessionAttributes.last_word=last_word;
        }
        if(!sessionAttributes.score)
        {   sessionAttributes.score=score;
        console.log(" the scores are "+sessionAttributes.score)
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
            sessionAttributes.score=0;
            sessionAttributes.last_word=first_word;
            sessionAttributes.words_answered=[];
            sessionAttributes.words_answered.push(first_word);
            attributesManager.deletePersistentAttributes();
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
             
            return first_word;
        }
       
        //start of the game flow, alexa answering the first word
        if(!sessionAttributes.words_answered)
        {
            sessionAttributes.words_answered=words_answered;
            var first_word=GetFirstWord();
            speakOutput=QuizLogic.QuizLogic.getRandomElement(constants.Constants.FIRST_WORD_MESSAGE)+first_word;
            if(!sessionAttributes.repeat)
            {
                sessionAttributes.repeat="";
            }
            sessionAttributes.repeat=speakOutput;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            return handlerInput.responseBuilder
            .speak(QuizLogic.QuizLogic.ssml(constants.Constants.AUDIO, QuizLogic.QuizLogic.getRandomElement(constants.Constants.INTRO_AUDIO))+speakOutput)
            .reprompt(QuizLogic.QuizLogic.getRandomElement(constants.Constants.REPROMT_MESSAGE1)+QuizLogic.QuizLogic.ssml(constants.Constants.BREAK,"1s")+QuizLogic.QuizLogic.getRandomElement(constants.Constants.REPROMT_MESSAGE2) +first_word[first_word.length-1])
            .getResponse();
        }
        
        var animals_slot=handlerInput.requestEnvelope.request.intent.slots.animals_and_birds.value;
        sessionAttributes.user_slot=animals_slot;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        console.log("7");
        
        
        //replay quiz - if user want to play the quiz again
        
             
        if (QuizLogic.QuizLogic.IsQuizEnded(sessionAttributes)) {
            if (sessionAttributes.user_slot === constants.Constants.YES) {
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                var flag = constants.Constants.FALSE;
                var firstWord=GetFirstWord();
                sessionAttributes.Checking = constants.Constants.FALSE;
                var say=constants.Constants.REPLAY_MESSAGE + firstWord;
                sessionAttributes.repeat=say;
                sessionAttributes.words_answered=[];
                sessionAttributes.last_word=firstWord;
                sessionAttributes.lifelines=3;
                sessionAttributes.score=0;
                sessionAttributes.user_slot="";
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                return handlerInput.responseBuilder
                .speak(say)
                .reprompt(say)
                .getResponse();
                    }
                    
            //if user doesn'y wants to play the quiz again
            else if (sessionAttributes.user_slot=== constants.Constants.NO) {
                flag = constants.Constants.FALSE;
                say=constants.Constants.REPLAY_MESSAGE;
                sessionAttributes.repeat=say;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                return handlerInput.responseBuilder
                .speak(say)
                .withShouldEndSession(constants.Constants.TRUE)
                .getResponse();
                    }
            else if (sessionAttributes.Checking) {
                say = constants.Constants.YES_OR_NO_MSG;
                sessionAttributes.repeat=say;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                return handlerInput.responseBuilder
                 .speak(say)
                 .reprompt(say)
                 .getResponse();
                    }
                }
      
      
        //to check if user has asked to skip
       
        if(animals_slot==="skip" || animals_slot==="pass" )
        {
            const next_letter = animals.filter(x => x.start.toLowerCase().trim() === sessionAttributes.last_word[sessionAttributes.last_word.length-1]);
            var next_animal= QuizLogic.QuizLogic.getRandomElement(next_letter[0].words);
            while(sessionAttributes.words_answered.includes(next_animal.toLowerCase()))
            {
                next_animal= QuizLogic.QuizLogic.getRandomElement(next_letter[0].words);
            }
            speakOutput = QuizLogic.QuizLogic.getRandomElement(constants.Constants.SKIP_PROMPTS) +next_animal;
            sessionAttributes.last_word=next_animal;
            sessionAttributes.words_answered.push(next_animal.toLowerCase());
            sessionAttributes.repeat=speakOutput;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        
            return handlerInput.responseBuilder
                .speak(QuizLogic.QuizLogic.ssml(constants.Constants.SAY_AS,constants.Constants.INTERJECTION,(QuizLogic.QuizLogic.getRandomElement(constants.Constants.SKIP_CONS)))+"  "+ QuizLogic.QuizLogic.ssml(constants.Constants.BREAK,"1s") + speakOutput)
                .reprompt(QuizLogic.QuizLogic.getRandomElement(constants.Constants.REPROMT_MESSAGE1)+QuizLogic.QuizLogic.ssml(constants.Constants.BREAK,"1s")+QuizLogic.QuizLogic.getRandomElement(constants.Constants.REPROMT_MESSAGE2) +next_animal[next_animal.length-1])
                .getResponse();
           
        }
        
        console.log("9");
       
        //checking if user answer is in our list of valid animals and birds
        var check_element= animals.filter(x => x.start.toLowerCase().trim() === animals_slot[0]);
        console.log("10");
        if(!check_element[0].words.includes(animals_slot.toLowerCase()))
        {   
           
            speakOutput=constants.Constants.INVALID ;
            sessionAttributes.repeat=speakOutput;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            return handlerInput.responseBuilder
            .speak(QuizLogic.QuizLogic.ssml(constants.Constants.SAY_AS,constants.Constants.INTERJECTION,QuizLogic.QuizLogic.getRandomElement(constants.Constants.SKIP_CONS))+QuizLogic.QuizLogic.ssml(constants.Constants.BREAK,"1s") +speakOutput)
            .reprompt(QuizLogic.QuizLogic.ssml(QuizLogic.QuizLogic.getRandomElement(constants.Constants.SKIP_AUDIO))+QuizLogic.QuizLogic.getRandomElement(constants.Constants.REPROMT_MESSAGE1)+QuizLogic.QuizLogic.ssml(constants.Constants.BREAK,"1s")+QuizLogic.QuizLogic.getRandomElement(constants.Constants.REPROMT_MESSAGE2)+ sessionAttributes.last_word[sessionAttributes.last_word.length-1])
            .getResponse();
        }
        
        //to check if the word has already been used in the game
        if(QuizLogic.QuizLogic.IsDuplicate(sessionAttributes))
        {
            console.log("11b");
            console.log("duplicate");
            speakOutput=QuizLogic.QuizLogic.getRandomElement(constants.Constants.DUPLICATE_MESSAGE);
            sessionAttributes.repeat=speakOutput;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            return handlerInput.responseBuilder
            .speak(QuizLogic.QuizLogic.ssml(constants.Constants.SAY_AS,constants.Constants.INTERJECTION,QuizLogic.QuizLogic.getRandomElement(constants.Constants.SKIP_CONS))+QuizLogic.QuizLogic.ssml(constants.Constants.BREAK,"1s") +speakOutput)
            .reprompt(QuizLogic.QuizLogic.getRandomElement(constants.Constants.REPROMT_MESSAGE1)+QuizLogic.QuizLogic.ssml(constants.Constants.BREAK,"1s")+QuizLogic.QuizLogic.getRandomElement(constants.Constants.REPROMT_MESSAGE2) + sessionAttributes.last_word[sessionAttributes.last_word.length-1])
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
        if(sessionAttributes.words_answered.length>=1)
        {   console.log("8a");
            if(!QuizLogic.QuizLogic.AnswerValidation(sessionAttributes))
            {console.log("8b");
            speakOutput =QuizLogic.QuizLogic.ssml(constants.Constants.SAY_AS,constants.Constants.INTERJECTION,QuizLogic.QuizLogic.getRandomElement(constants.Constants.SKIP_CONS))+ QuizLogic.QuizLogic.ssml(constants.Constants.BREAK,"1s") +QuizLogic.QuizLogic.getRandomElement(constants.Constants.WRONG) +sessionAttributes.last_word[sessionAttributes.last_word.length-1]+" . "+QuizLogic.QuizLogic.ssml(constants.Constants.BREAK,"1s")+ ` you are left with ${sessionAttributes.lifelines-1}  lifelines . ` ;
            sessionAttributes.lifelines=sessionAttributes.lifelines-1;
            sessionAttributes.repeat=speakOutput;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            
            //if lifelines are finished , end the game and declare scores. ask if user wants to replay the game
             if(sessionAttributes.lifelines===0)
            {   speakOutput=constants.Constants.RESULT_MESSAGE+sessionAttributes.score+QuizLogic.QuizLogic.ssml(constants.Constants.BREAK,"1s")+constants.Constants.END_MESSAGE + "would you like to play again? " ; 
                sessionAttributes.repeat=speakOutput;
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        const scoreAttributes = { "score" :sessionAttributes.score} ;
        
attributesManager.setPersistentAttributes(scoreAttributes);
await attributesManager.savePersistentAttributes();
                
                bt7.bodyTemplate6Data.textContent.primaryText.text=constants.Constants.RESULT_MESSAGE+sessionAttributes.score;
                //bt7.bodyTemplate7Data.image.sources[0].url=imgurl.Image[random].url;
                
                
                             if (helper.Helper.supportsAPL(handlerInput))
                    {
                        handlerInput.responseBuilder
                        .addDirective({
               type: 'Alexa.Presentation.APL.RenderDocument',
               document: require('./WelcomeTemplate.json'),
              datasources: require('./ScoreTemplateData.json'),
             });
                    }
                            
                            
                
                return handlerInput.responseBuilder
                .speak(QuizLogic.QuizLogic.ssml(constants.Constants.SAY_AS,constants.Constants.INTERJECTION,QuizLogic.QuizLogic.getRandomElement(constants.Constants.SCORE_CONS))+ QuizLogic.QuizLogic.ssml(constants.Constants.BREAK,"1s") +speakOutput)
                .reprompt(' would you like to play again? ')
                //.withShouldEndSession(true)
                .getResponse();
            }
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(QuizLogic.QuizLogic.getRandomElement(constants.Constants.REPROMT_MESSAGE1)+QuizLogic.QuizLogic.ssml(constants.Constants.BREAK,"1s")+QuizLogic.QuizLogic.getRandomElement(constants.Constants.REPROMT_MESSAGE2) + sessionAttributes.last_word[sessionAttributes.last_word.length-1])
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
        sessionAttributes.speak=speakOutput;
        speakOutput+=" ";
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
         bt8.bodyTemplate6Data.textContent.primaryText.text=constants.Constants.DISPLAY_LAST_WORD + sessionAttributes.last_word;
         if (helper.Helper.supportsAPL(handlerInput))
        {
            handlerInput.responseBuilder
            .addDirective({
   type: 'Alexa.Presentation.APL.RenderDocument',
   document: require('./WelcomeTemplate.json'),
  datasources: require('./gameData.json'),
 });
        }
        return handlerInput.responseBuilder
            .speak(QuizLogic.QuizLogic.ssml(constants.Constants.SAY_AS,constants.Constants.INTERJECTION,QuizLogic.QuizLogic.getRandomElement(constants.Constants.SPEECHCONS))+QuizLogic.QuizLogic.ssml(constants.Constants.BREAK,"1s")+speakOutput)
            .reprompt(QuizLogic.QuizLogic.getRandomElement(constants.Constants.REPROMT_MESSAGE1)+QuizLogic.QuizLogic.ssml(constants.Constants.BREAK,"1s")+sessionAttributes.last_word[sessionAttributes.last_word.length-1])
            .getResponse();
    }
};






const WelcomeBackRequestHandler = {
   canHandle(handlerInput) {
       

       const attributesManager = handlerInput.attributesManager;
       const sessionAttributes = attributesManager.getSessionAttributes() || {};

       const score = sessionAttributes.hasOwnProperty('score') ? sessionAttributes.score : 0;

       return handlerInput.requestEnvelope.request.type === 'LaunchRequest' && score;

   },
   handle(handlerInput) {
      const attributesManager = handlerInput.attributesManager;
       const sessionAttributes = attributesManager.getSessionAttributes() || {};
       handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

       var score = sessionAttributes.hasOwnProperty('score') ? sessionAttributes.score : 0;
       speakOutput=" Welcome back to the jungle antakshari. Your last score was "+score+". shall we start the game? "
       bt7.bodyTemplate6Data.textContent.primaryText.text=speakOutput;
       sessionAttributes.repeat=speakOutput;
       //attributesManager.deletePersistentAttributes();
       if (helper.Helper.supportsAPL(handlerInput))
        {
            handlerInput.responseBuilder
            .addDirective({
   type: 'Alexa.Presentation.APL.RenderDocument',
   document: require('./WelcomeTemplate.json'),
  datasources: require('./ScoreTemplateData.json'),
 });
        }
           
       return handlerInput.responseBuilder
           .speak(speakOutput)
           .reprompt("Try beating your last score . say yes if you are ready to start")
           .withShouldEndSession(false)
           .getResponse();
   }
};




const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        speakOutput = 'you will have to answer a animal or bird whose name starts with last letter of previous word. for example, if i say cat, you have to say a creature starting with T . you will have three lifelines . for every correct answer, you get a plus ten . ';

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


const RepeatIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.RepeatIntent');
    },
    handle(handlerInput) {
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        speakOutput = sessionAttributes.repeat;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(false)
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
const LoadScoreInterceptor = {
   async process(handlerInput) {
       const attributesManager = handlerInput.attributesManager;
       const sessionAttributes = await attributesManager.getPersistentAttributes() || {};

       const score = sessionAttributes.hasOwnProperty('score') ? sessionAttributes.score : 0;
       if (score) {
           attributesManager.setSessionAttributes(sessionAttributes);
       }
   }
};



// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
.withPersistenceAdapter(
new persistenceAdapter.S3PersistenceAdapter({bucketName:process.env.S3_PERSISTENCE_BUCKET})
)
    .addRequestHandlers(
        WelcomeBackRequestHandler,
        LaunchRequestHandler,
        AnimalsAndBirdsIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        RepeatIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addRequestInterceptors(
    LoadScoreInterceptor
)
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
