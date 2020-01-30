"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });

const animals=__importDefault(require('./animals.json'));
const fruits=__importDefault(require('./fruits.json'));
//var Questions_json_1 = __importDefault(require("../models/Questions.json"));
//var helper_1 = require("./helper");
//var ImageUrls_json_1 = __importDefault(require("../models/ImageUrls.json"));
//var imageDesign_Q_json_1 = __importDefault(require("../models/imageDesign_Q.json"));
//var UrlConstants_1 = require("../models/UrlConstants");
var constants_1 = require("./Constants");
var QuizLogic = /** @class */ (function () {
    function QuizLogic() {
    }
    /**
     * Gets current score of player number passed.
     * @param session Session attribute to get player info
     * @returns score of current active players
     */
    QuizLogic.GetScore = function (session, PlayerNumber) {
        var players = new Array();
        players = session.Players;
        var PlayerScore = 0;
        if (players) {
            players.forEach(function (element) {
                if (element.PlayerNumber == PlayerNumber) {
                    PlayerScore = element.Score;
                }
            });
        }
        return PlayerScore;
    };
    
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
    
    /*
    starting with first word of the game
    */
    /*QuizLogic.GetFirstWord = function (session,handlerInput)
    {
      
          var first_word_array=[];
           if(session.category==="animal")
            {first_word_array=animals.filter(x => x.start.toLowerCase().trim() === "a");
            }
            else if(session.category==="fruit")
            {
             first_word_array=fruits.filter(x => x.start.toLowerCase().trim() === "a");
            }
            
            //fetch random words
                var first_word=QuizLogic.getRandomElement(first_word_array[0].words);
                    session.last_word=first_word;
                 session.words_answered.push(first_word);
                 handlerInput.attributesManager.setSessionAttributes(session);
                 return first_word;
    };*/
    
   
    
   
    /**
     * Updates the score of player if answer is correct.
     * @param session Session attribute to get player info
     * @param UserAnswer
     * @returns playerinfo with updated score
     */
    QuizLogic.getUpdatedScore = function (session, UserAnswer) {
        var quizInfo = session.QuizModel;
        var players = new Array();
        players = session.Players;
        if (QuizLogic.CheckAnswer(session, UserAnswer)) {
            if (players) {
                players.forEach(function (element) {
                    if (element.isActive) {
                        if (element.Score) {
                            element.Score = element.Score + constants_1.Constants.score_point;
                        }
                        else {
                            element.Score = 0;
                            element.Score = element.Score + constants_1.Constants.score_point;
                        }
                    }
                });
            }
        }
        return players;
    };
    /**
     * Gets the id number of current active player.
     * @param session Session attribute to get player info
     * @returns index
     */
    QuizLogic.getActivePlayerIndex = function (session) {
        var quizInfo = session.QuizModel;
        var players = new Array();
        players = session.Players;
        for (var i = 0; i < players.length; i++) {
            if (players[i].isActive) {
                return i;
            }
        }
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
     * Checks if user answer is correct.
     * @param session Session attribute to get player info
     * @returns {bool} Boolean whether or not answer is correct
     */
    QuizLogic.CheckAnswer = function (session, UserAnswer) {
        var quizInfo = session.QuizModel;
        var players = new Array();
        players = session.Players;
        if (UserAnswer.toLowerCase().trim() == quizInfo.CorrectAnswerOption.toLowerCase().trim() || UserAnswer.toLowerCase().trim() == quizInfo.CorrectAnswer.toLowerCase().trim()) {
            return constants_1.Constants.TRUE;
        }
        else {
            return constants_1.Constants.FALSE;
        }
    };
    /**
     * Creates array of player numbers that are winners.
     * @param session Session attribute to get player info
     * @returns array of winners
     */
    QuizLogic.checkWinner = function (session) {
        var players = new Array();
        players = session.Players;
        var max = 0;
        var player_id = 0;
        var winners = new Array();
        if (players) {
            for (var i = 0; i < players.length; i++) {
                if (players[i].Score > max) {
                    max = players[i].Score;
                    player_id = players[i].PlayerNumber;
                }
            }
            var j = 0;
            for (i = 0; i < players.length; i++) {
                if (players[i].Score == max && players[i].Score !== 0) {
                    winners[j] = players[i].PlayerNumber;
                    j += 1;
                }
            }
        }
        return winners;
    };
    /**
     * Checks if quiz has ended.
     * @param session Session attribute to get number of players
     * @returns {bool} Boolean whether quiz has ended or not
     */
    QuizLogic.IsQuizEnded = function (session) {
        var isEnded = constants_1.Constants.FALSE;
        var numberOfQuestionsAsked = 0;
        var numberofPlayers = session.Number_of_Players;
        if (session.QuizModel) {
            numberOfQuestionsAsked = session.QuizModel.QuestionsAsked.length;
        }
        if ((numberofPlayers * constants_1.Constants.QUESTIONS_PER_PLAYER) == numberOfQuestionsAsked) {
            isEnded = constants_1.Constants.TRUE;
        }
        return isEnded;
    };
    return QuizLogic;
}());
exports.QuizLogic = QuizLogic;
