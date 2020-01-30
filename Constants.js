"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constants = /** @class */ (function () {
    function Constants() {
    }
    //ssml related messages
    Constants.AUDIO = 'audio';
    Constants.BREAK = 'break';
    Constants.BREAK_TIME = "0.30s";
    Constants.BREAK_TAG = "<br/>";
    Constants.SAY_AS = 'say-as';
    Constants.PHONEME = 'phoneme';
    Constants.EMPHASIS = 'emphasis';
    Constants.AMAZON_EFFECT = 'amazon:effect';
    //Constants.PROSODY
    //Quiz game related messages
    Constants.MAX_PLAYER_LIMIT_MSG = "आपके पास quiz में minimum 1 और maximum 5 players हो सकते हैं, please बताएं कि कितने players खेल रहे हैं?";
    Constants.PLAYER_NUM_UNRECOGNISED_MSG = "Sorry, मुझे वह समझ नहीं आया। please बताएं कि कितने players खेल रहे हैं?";
    Constants.QUIZ_REPLAY_MSG = "चलिए फिर से quiz खेलते है . आप कितने players खेलना चाहते हो?";
    Constants.QUIZ_STOP_MSG = "Vir Quiz खेलने के लिए धन्यवाद";
    Constants.YES_OR_NO_MSG = "Please yes या no में से एक कहिये ";
    Constants.QUIZ_END_MSG = "आपने खेल समाप्त कर लिया है ";
    Constants.CONGRATULATIONS_MSG = "बधाई हो!   ";
    Constants.ZERO_WINNER_MSG = "sorry, इस quiz के लिए हमारे पास कोई विजेता नहीं है।!Better luck next time!";
    Constants.PLAY_AGAIN_MSG = "  क्या आप फिर से game खेलना चाहेंगे?";
    Constants.NEXT_QUESTION_MSG = "आपके लिए अगला सवाल है ";
    Constants.TIE_MSG = "के बीच में tie हुई है ";
    Constants.SCORE_MSG = "और आपका score है ";
    Constants.ZERO_SCORE_MSG = "और आपका score है zero";
    Constants.QUESTION_HELP_MSG = 'आपसे पूछे जायेंगे कुछ सवाल , और आपको दिए गए दो options में से कोई एक choose करना होगा.';
    Constants.OPTION_HELP_MSG = 'आप A. ya B. बोल सकते हो, या सीधे, answer भी कह सकते हो . ';
    Constants.FALLBACK_MSG = "sorry! मुझे समझ नहीं आया. क्या आप फिर से कहोगे";
    Constants.NO_IDEA = "no idea";
    Constants.NUMBER_OF_PLAYERS = "Number_of_Players";
    Constants.PRINT_PLAYER = "Player: ";
    Constants.PRINT_SCORE = "Score: ";
    Constants.WINNER_PLAYER_MSG = "बधाई हो! इस खेल का विजेता है ";
    Constants.PRINT_TIE_MSG = "Hey! there was a tie!";
    Constants.OPTION_A = 'a';
    Constants.OPTION_B = 'b';
    Constants.A = "A. ";
    Constants.B = "B. ";
    //Quiz game related dynamic values
    Constants.TOTAL_PLAYERS = 5;
    Constants.score_point = 10;
    Constants.QUESTIONS_PER_PLAYER = 10;
    //Generic keywords
    Constants.YES = "yes";
    Constants.NO = "no";
    Constants.FALSE = false;
    Constants.TRUE = true;
    Constants.NULL = null;
    Constants.UNDEFINED = undefined;
    Constants.AND = "and";
    Constants.NA = "NA";
    Constants.QUESTION_MARK = "?";
    Constants.EMPTY_STRING = "";
    Constants.NONE = 'NONE';
    //error messages
    Constants.ER_SUCCESS_MATCH = 'ER_SUCCESS_MATCH';
    Constants.ER_SUCCESS_NO_MATCH = 'ER_SUCCESS_NO_MATCH';
    //Intent and request types
    Constants.CANCEL_INTENT = "AMAZON.CancelIntent";
    Constants.HELP_INTENT = "AMAZON.HelpIntent";
    Constants.REPEAT_INTENT = "AMAZON.RepeatIntent";
    Constants.STOP_INTENT = "AMAZON.StopIntent";
    Constants.FALLBACK_INTENT = "AMAZON.FallbackIntent";
    Constants.SESSION_END_REQUEST = "SessionEndedRequest";
    Constants.LAUNCH_REQUEST = "LaunchRequest";
    Constants.INTENT_REQUEST = "IntentRequest";
    Constants.ANSWER_INTENT = "AnswerIntent";
    //APL related content
    Constants.PRESENTATION__APL = 'Alexa.Presentation.APL';
    Constants.APL_RENDER_DOCUMENT = 'Alexa.Presentation.APL.RenderDocument';
    Constants.APL_DIRECTIVE_ACTIVE_PLAYER = '../models/imageDesign_Q.json';
    Constants.APL_DIRECTIVE_WINNER = '../models/imageDesign_winner.json';
    
    //////////////////////////////
    //Quiz game related dynamic values
    Constants.TOTAL_PLAYERS = 5;
    Constants.WRONG_RESPONSE=[" ooooo.... you were playing good dude!"," sorry you're out dear"," that was an easy one....you missed it","  better luck next time"," i enjoyed your company"," see you next time"," ohoo..you got it wrong"," aiiyoooo...wrong wrong wrong"," its a wrong one!"];
    Constants.RESULT_MESSAGE=" time for result now ! your score is ";
    Constants.END_MESSAGE=" thank you for playing!";
    
    
    
    
    
    
    
    
    
    
    return Constants;
}());
exports.Constants = Constants;
