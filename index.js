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
        var amountOfListenersOfThisEvent = Object.keys(this.listeners[eventName]).length;
        if (amountOfListenersOfThisEvent !== 0) {
            for (var id = 1; id <= amountOfListenersOfThisEvent; id++) {
                this.listeners[eventName][id].eventHandler(data);
            }
        }
        else {
            if (this.logs) {
                console.log("No listeners found for eventName: ".concat(String(eventName)));
            }
        }
    };
    PubSub.prototype.subscribe = function (eventName, eventHandler) {
        var listenersOfThisEvent = this.listeners[eventName];
        if (listenersOfThisEvent) {
            var newListenerIndex = Number(Object.keys(listenersOfThisEvent).length + 1);
            listenersOfThisEvent[newListenerIndex] = {
                eventHandler: eventHandler
            };
        }
        else {
            this.listeners[eventName] = {};
            this.listeners[eventName][1] = {
                eventHandler: eventHandler
            };
        }
    };
    return PubSub;
}());
exports.PubSub = PubSub;
