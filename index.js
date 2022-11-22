"use strict";
exports.__esModule = true;
exports.PubSub = void 0;
var PubSub = /** @class */ (function () {
    /**
     * Initializes `PubSub` instance
     * @param Options
     */
    function PubSub(_a) {
        var events = _a.events, _b = _a.enableLogs, enableLogs = _b === void 0 ? false : _b;
        this.subscribers = {};
        if (events)
            this.events = events;
        else {
            console.log("Warning in PubSub: Events were not passed when initializing class");
        }
        if (enableLogs)
            this.enableLogs = enableLogs;
    }
    /**
     * Publishes the specified event with data
     * @param eventName name of the event
     * @param data
     */
    PubSub.prototype.publish = function (eventName, data) {
        var subscribersOfThisEvent = this.subscribers[eventName];
        var subscribersAmount;
        if (subscribersOfThisEvent) {
            subscribersAmount = Object.keys(subscribersOfThisEvent).length;
        }
        else
            subscribersAmount = 0;
        if (subscribersAmount === 0) {
            if (this.enableLogs) {
                console.log("No listeners found for eventName: ".concat(String(eventName)));
                return;
            }
        }
        for (var subscriber in subscribersOfThisEvent) {
            subscribersOfThisEvent[subscriber].eventHandler(data);
            if (subscribersOfThisEvent[subscriber].forOneEventOnly) {
                delete subscribersOfThisEvent[subscriber];
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
        var subscribersOfThisEvent = this.subscribers[eventName];
        var newSubscriberIndex;
        if (subscribersOfThisEvent) {
            newSubscriberIndex = Number(Object.keys(subscribersOfThisEvent).length + 1);
        }
        else {
            newSubscriberIndex = 1;
            this.subscribers[eventName] = {};
        }
        this.subscribers[eventName][newSubscriberIndex] = {
            eventHandler: eventHandler,
            forOneEventOnly: false
        };
        var unsubscribeHandler = function () {
            delete _this.subscribers[eventName][newSubscriberIndex];
        };
        return unsubscribeHandler;
    };
    /**
     * Subscribes for one event publish only
     * @param eventName The name of event
     * @param eventHandler callback that will perform on every event publish
     */
    PubSub.prototype.subscribeForOnePublishOnly = function (eventName, eventHandler) {
        var subscribersOfThisEvent = this.subscribers[eventName];
        var newSubscriberIndex;
        if (subscribersOfThisEvent) {
            newSubscriberIndex = Number(Object.keys(subscribersOfThisEvent).length + 1);
        }
        else {
            newSubscriberIndex = 1;
            this.subscribers[eventName] = {};
        }
        this.subscribers[eventName][newSubscriberIndex] = {
            eventHandler: eventHandler,
            forOneEventOnly: true
        };
    };
    /**
     * Removes all subscribers/listeners from memory
     */
    PubSub.prototype.removeAllSubscribers = function () {
        this.subscribers = {};
    };
    /**
     * Removes subscribers/listeners of specific event from memory
     * @param eventName Name of the event
     */
    PubSub.prototype.removeAllSubscribersFromEvent = function (eventName) {
        if (!this.subscribers[eventName] && this.enableLogs) {
            console.log("PubSub warning: No subscribers of event=".concat(eventName, " found while trying to remove\nsubscribers from memory"));
            return;
        }
        delete this.subscribers[eventName];
    };
    /**
     * Checks if given event has any active subscribers/listeners
     * @param eventName
     */
    PubSub.prototype.hasSubscribers = function (eventName) {
        if (Object.keys(this.subscribers[eventName]).length > 0) {
            return true;
        }
        return false;
    };
    return PubSub;
}());
exports.PubSub = PubSub;
