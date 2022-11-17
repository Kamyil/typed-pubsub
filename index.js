"use strict";
exports.__esModule = true;
exports.PubSub = void 0;
var PubSub = /** @class */ (function () {
    function PubSub(_a) {
        var events = _a.events, _b = _a.logs, logs = _b === void 0 ? false : _b;
        this.listeners = {};
        if (events)
            this.events = events;
        else
            console.error("ERROR in PubSub: Events were not passed when initializing class");
        if (logs)
            this.logs = logs;
    }
    PubSub.prototype.publish = function (eventName, data) {
        var listenersOfThisEvent = this.listeners[eventName];
        if (Object.keys(listenersOfThisEvent).length !== 0) {
            for (var listener in listenersOfThisEvent) {
                listenersOfThisEvent[listener].eventHandler(data);
            }
        }
        else {
            if (this.logs) {
                console.log("No listeners found for eventName: ".concat(String(eventName)));
            }
        }
    };
    PubSub.prototype.subscribe = function (eventName, eventHandler) {
        var _this = this;
        var listenersOfThisEvent = this.listeners[eventName];
        var newListenerIndex;
        if (listenersOfThisEvent) {
            newListenerIndex = Number(Object.keys(listenersOfThisEvent).length + 1);
        }
        else {
            newListenerIndex = 1;
            this.listeners[eventName] = {};
        }
        this.listeners[eventName][newListenerIndex] = {
            eventHandler: eventHandler
        };
        var unsubscribeHandler = function () {
            delete _this.listeners[eventName][newListenerIndex];
        };
        return unsubscribeHandler;
    };
    return PubSub;
}());
exports.PubSub = PubSub;
