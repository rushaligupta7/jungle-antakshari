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
    Constants.INTERJECTION='interjection';
    //Constants.PROSODY
    //Quiz game related messages
  
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
    
    
    //////////////////////////////
    //Quiz game related dynamic values
    
    Constants.WRONG_RESPONSE=[" ooooo.... you were playing good dude! "," sorry you're out dear "," that was an easy one....you missed it","  better luck next time"," i enjoyed your company"," see you next time"," ohoo..you got it wrong"," aiiyoooo...wrong wrong wrong"," its a wrong one!"];
    Constants.RESULT_MESSAGE=" time for result now ! your score is ";
    Constants.END_MESSAGE=" thank you for playing! ";
    Constants.START_PROMPTS=[" let me think something ,mmmmm ", " it can be ","i will say "];
    Constants.SKIP_PROMPTS=[" hmmm, let me try ", " ok i will go with ","yay , i know , its a "];
    Constants.REPROMT_MESSAGE1=[" tick tick tick.....fast "," time is running a marathon ", "come on come on  ", " hurry up partner ", " do not overthink "," you can do it "," go ahead "];
    Constants.REPROMT_MESSAGE2=[" start with "," last letter was "," say with ", " try with "," you have to start with "," find the one starting with "];
    Constants.FIRST_WORD_MESSAGE=[" so lets start with "," lets get started with "," i will start with "," lets start . the first word is "];
    Constants.DUPLICATE_MESSAGE=[" this was used earlier ", " you can't repeat this again "," no cheating haa , this word is taken "];
    Constants.REPLAY_MESSAGE=" lets play the game again! the first word is ";
    Constants.BYE_MESSAGE=" nice playing with you! see you again! ";
    Constants.INVALID=" this animal or bird hopefully does not exist! ";
    Constants.WRONG=[" this does not start with ", " it should start with ","please start with ", " it must start with "];
    Constants.DISPLAY_LAST_WORD=" Enjoy Playing ! Last word was : ";
    
    ////////////////////
    //urls of audio_files
    Constants.SKIP_AUDIO=["https://wordantakshari.s3.amazonaws.com/skip1.mp3","https://wordantakshari.s3.amazonaws.com/skip2.mp3","https://wordantakshari.s3.amazonaws.com/skip3.mp3","https://wordantakshari.s3.amazonaws.com/skip4.mp3"];
    Constants.INTRO_AUDIO=["https://wordantakshari.s3.amazonaws.com/score1.mp3"];
    Constants.SCORE_AUDIO=["https://wordantakshari.s3.amazonaws.com/score1.mp3"];
    Constants.POP_AUDIO="https://wordantakshari.s3.amazonaws.com/popsound.mp3";
    Constants.SPEECHCONS=["ah ","all righty ","awesome ","balle balle ","bang ","bingo ","bravo ","checkmate ","hurray ","jinx ","ooh la la ","righto ","shabash ","waah "];
    Constants.SKIP_CONS=["aii ","aiyo ","arrey ","aw ","dishoom "];
    Constants.SCORE_CONS=["beep beep ","meow ","well well "];
    

    
    return Constants;
}());
exports.Constants = Constants;
