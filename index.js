"use strict";
exports.__esModule = true;
exports.PubSub = void 0;
var PubSub = /** @class */ (function () {
    /**
     * Initializes `PubSub` instance
     * @param Options
     */
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
    /**
     * Publishes the specified event with data
     * @param eventName name of the event
     * @param data
     */
    PubSub.prototype.publish = function (eventName, data) {
        var listenersOfThisEvent = this.listeners[eventName];
        if (Object.keys(listenersOfThisEvent).length !== 0) {
            for (var listener in listenersOfThisEvent) {
                listenersOfThisEvent[listener].eventHandler(data);
                if (listenersOfThisEvent[listener].forOneEventOnly) {
                    delete listenersOfThisEvent[listener];
                }
            }
        }
        else {
            if (this.logs) {
                console.log("No listeners found for eventName: ".concat(String(eventName)));
            }
        }
    };
    /**
     * Subscribes to defined event. Every time when this specific event will be published
     * the eventHandler will be called
     * @param eventName The name of event
     * @param eventHandler callback that will perform on every event publish
     * @returns Function that allows this subscribe listener to unsubscribe
     */
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
            eventHandler: eventHandler,
            forOneEventOnly: false
        };
        var unsubscribeHandler = function () {
            delete _this.listeners[eventName][newListenerIndex];
        };
        return unsubscribeHandler;
    };
    /**
     * Subscribes for one event publish only
     * @param eventName The name of event
     * @param eventHandler callback that will perform on every event publish
     */
    PubSub.prototype.subscribeForOneEventOnly = function (eventName, eventHandler) {
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
            eventHandler: eventHandler,
            forOneEventOnly: true
        };
    };
    return PubSub;
}());
exports.PubSub = PubSub;
