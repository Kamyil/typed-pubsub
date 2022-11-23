"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
     * Allows to publish event asynchronously, which makes sure that no further code will be executed
     * until all subscribers receive your event publish
     * @param eventName name of the event you want to publish
     * @param data data that will come with this event publish
     * @returns boolean that indicates if publish went successfully or not
     */
    PubSub.prototype.publishAsync = function (eventName, data) {
        return __awaiter(this, void 0, void 0, function () {
            var subscribersOfThisEvent, subscribersAmount, subscriber;
            return __generator(this, function (_a) {
                try {
                    subscribersOfThisEvent = this.subscribers[eventName];
                    subscribersAmount = void 0;
                    if (subscribersOfThisEvent) {
                        subscribersAmount = Object.keys(subscribersOfThisEvent).length;
                    }
                    else
                        subscribersAmount = 0;
                    if (subscribersAmount === 0) {
                        if (this.enableLogs) {
                            console.log("No listeners found for eventName: ".concat(String(eventName)));
                        }
                        return [2 /*return*/, false];
                    }
                    for (subscriber in subscribersOfThisEvent) {
                        subscribersOfThisEvent[subscriber].eventHandler(data);
                        if (subscribersOfThisEvent[subscriber].forOneEventOnly) {
                            delete subscribersOfThisEvent[subscriber];
                        }
                    }
                    return [2 /*return*/, true];
                }
                catch (error) {
                    if (this.enableLogs) {
                        console.error("error when trying to asynchronously publish event:".concat(String(eventName), ".\nError"), error);
                    }
                    return [2 /*return*/, false];
                }
                return [2 /*return*/];
            });
        });
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
    PubSub.prototype.clearAllSubscribers = function () {
        this.subscribers = {};
    };
    /**
     * Removes subscribers/listeners of specific event from memory
     * @param eventName Name of the event
     */
    PubSub.prototype.clearAllSubscribersFromEvent = function (eventName) {
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
