"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });

const animals=__importDefault(require('./animals.json'));
var constants_1 = require("./Constants");
var QuizLogic = /** @class */ (function () {
    function QuizLogic() {
    }
    
    /**function to generate random element of an array
     * */
    QuizLogic.getRandomElement= function (array)
    {
           return (array[Math.floor(Math.random() * array.length)]);

    };
    
    /*
    function to validate that user says word starting with last letter of previous word
    */
    QuizLogic.AnswerValidation = function (session)
    {
        if(session.user_slot[0]!==session.last_word[session.last_word.length-1])
        {
            return false;
        }
        else
        return true;
    };
    
    
    /*
    check if element in the word list
    */
    QuizLogic.IsDuplicate = function(session)
    {
        if(session.words_answered.includes(session.user_slot.toLowerCase()))
        {
            return true;
        }
        else
        return false;
    };
    
 
    /**
     * Helps create SSML tags by specifying parameters.
     * @param {string} type The type of SSML tag to use
     * @param {string} argument The value of the main control of the tag (e.g. break time, effect type)
     * @param {string} content The content to be wrapped around by tags
     * @returns {string} returns ssml content in ssml tag
     */
    QuizLogic.ssml = function (type, argument, content) {
        switch (type) {
            case constants_1.Constants.SAY_AS:
                return "<say-as interpret-as=\"" + argument + "\">" + content + "</say-as>";
            case constants_1.Constants.PHONEME:
                return "<phoneme alphabet=\"ipa\" ph=\"" + argument + "\">" + content + "</say-as>";
            case constants_1.Constants.AUDIO:
                
                return "<audio src=\"" + argument + "\" />";
            case constants_1.Constants.EMPHASIS:
                return "<emphasis level=\"" + argument + "\">" + content + "</emphasis>";
            case constants_1.Constants.BREAK:
                return "<break time=\"" + argument + "\" />";
            case constants_1.Constants.AMAZON_EFFECT:
                return "<amazon:effect name=\"" + argument + "\">" + content + "</amazon:effect>";
            default:
                return "no response";
        }
    };
    
    /**
     * Checks if quiz has ended.
     * @param session Session attribute to get number of players
     * @returns {bool} Boolean whether quiz has ended or not
     */
    QuizLogic.IsQuizEnded = function (session) {
        
        if(session.lifelines===0)
        return true;
        else
        return false;
       
    };
    return QuizLogic;
}());
exports.QuizLogic = QuizLogic;
