"use strict";
exports.__esModule = true;
exports.PubSub = void 0;
var PubSub = /** @class */ (function () {
    function PubSub(_a) {
        var events = _a.events, logs = _a.logs;
        this.listeners = [];
        if (events)
            this.events = events;
        else
            console.error("ERROR in PubSub: Events were not passed when initializing class");
        if (logs)
            this.logs = logs;
    }
    PubSub.prototype.publish = function (eventName, data) {
        var listeners = this.listeners.filter(function (listener) { return listener.subscribedEventName === eventName; });
        if (listeners.length !== 0) {
            listeners.forEach(function (listener) { return listener.eventHandler(data); });
        }
        else {
            if (this.logs) {
                console.log("No listeners found for eventName: ".concat(String(eventName)));
            }
        }
    };
    PubSub.prototype.subscribe = function (eventName, eventHandler) {
        this.listeners.push({
            subscribedEventName: eventName,
            eventHandler: eventHandler
        });
    };
    return PubSub;
}());
exports.PubSub = PubSub;
