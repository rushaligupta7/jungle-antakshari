"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Helper = /** @class */ (function () {
    function Helper() {
    }
    /**
     * Checks whether APL is supported.
     * @param {Object} handlerInput The handlerInput from the incoming request
     * @returns {bool} Boolean whether or not display supports APL
     */
    Helper.supportsAPL = function (handlerInput) {
        var supportedInterfaces = handlerInput.requestEnvelope.context.System.device.supportedInterfaces;
        var aplInterface = supportedInterfaces['Alexa.Presentation.APL'];
        return aplInterface !== null && aplInterface !== undefined;
    };
   
        /**
     * Checks whether a display is supported.
     * @param {Object} handlerInput The handlerInput from the incoming request
     * @returns {bool} Boolean whether or not it supports a display
     */
    Helper.hasDisplay = function (handlerInput) {
        // returns true if the skill is running on a device with a display (Echo Show, Echo Spot, etc.)
        if (handlerInput.requestEnvelope.context &&
            handlerInput.requestEnvelope.context.System &&
            handlerInput.requestEnvelope.context.System.device &&
            handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
            handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display) {
            return true;
        }
        else {
            return false;
        }
    };
   
        return Helper;
}());
exports.Helper = Helper;
