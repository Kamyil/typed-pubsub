# Typed PubSub

Know the events you can publish             |  Know the data you will receive after subscribing to specific event
:-------------------------:|:-------------------------:
  <img width="500" alt="Zrzut ekranu 2022-11-17 o 02 01 48" src="https://user-images.githubusercontent.com/26087070/202500892-2eed5ed1-c0de-4e4c-bf7c-3a7fbea3c00d.png">  |    <img width="500" alt="Zrzut ekranu 2022-11-17 o 02 02 52" src="https://user-images.githubusercontent.com/26087070/202501002-05133f4b-7de6-42ab-af24-69b04ae30d71.png">
  
Typical **PubSub**, **EventBus**, **EventEmitter** (whatever you call it), that you can expect, but **fully** and **hardly** typed with full type inference, which means that you will be able to get all autocomplete and autovalidation. 
Also it's scalable, very-performant and **bLaZiNgLy-fASt** with **Zero dependencies**

Realistically speaking - the code is so small that you can even copy it from `index.ts` file and it will work. But of course I will appreciate if someone would decide to install it via NPM 😅 or give it a star on GitHub

**NPM**: <https://www.npmjs.com/package/@kamyil/typed-pubsub>
**GitHub**: <https://github.com/Kamyil/typed-pubsub>

- [Typed PubSub](#typed-pubsub)
  - [How to use it?](#how-to-use-it)
  - [Do I have to declare values on initialisation?](#do-i-have-to-declare-values-on-initialisation)
  - [... so do the values even matter?](#-so-do-the-values-even-matter)
  - [Performance test](#performance-test)
  - [Optional logging](#optional-logging)
  - [Using it with JavaScript](#using-it-with-javascript)
  - [What is PubSub?](#what-is-pubsub)
  - [In which way this library is blazingly fast?](#in-which-way-this-library-is-blazingly-fast)
  - [I would like to extend the functionality of it](#i-would-like-to-extend-the-functionality-of-it)
  - [How to unsubscribe?](#how-to-unsubscribe)
  - [I want to subscribe for one event publish only](#i-want-to-subscribe-for-one-event-publish-only)
  - [I want to remove/clear all subscribers](#i-want-to-removeclear-all-subscribers)
  - [I want to remove subscribers from specific event](#i-want-to-remove-subscribers-from-specific-event)

## How to use it?

1. Simply import `PubSub` from package *(since it's named import, VSCode WebStorm and other IDEs should be able to auto-import it easily)*

```ts
import { PubSub } from '@kamyil/typed-pubsub';
```

2. Declare some `Events`. Doesn't matter how you call them.
The only one important thing is to keep them in one-level nested object. In which way you will declare event names and what data you will pass to them - it's completely up to you

```ts
// 1
import { PubSub } from '@kamyil/typed-pubsub';
// 2
const Events = {
  'user:registered': { firstName: '', lastName: '', age: 22 },
  'age:changed': 40,
  'firstName:changed': 'Matt',
  'lastName:changed': 'Murdock'
}
```

3. Create `PubSub` instance with `Events` passed

```ts
// 1
import { PubSub } from '@kamyil/typed-pubsub';
// 2
const Events = {
  'user:registered': { firstName: '', lastName: '', age: 22 },
  'age:changed': 40,
  'firstName:changed': 'Matt',
  'lastName:changed': 'Murdock'
};
// 3
const pubSub = new PubSub({ 
  events: Events 
});
```

4. And voilá! You have your PubSub up and running.
You can start publishing the events and subscribing to them. With all types auto-infered

<img width="853" alt="Zrzut ekranu 2022-11-17 o 02 01 42" src="https://user-images.githubusercontent.com/26087070/202328615-022efc76-d616-4723-acf4-b377ee639ce2.png">
<img width="853" alt="Zrzut ekranu 2022-11-17 o 02 01 48" src="https://user-images.githubusercontent.com/26087070/202328607-daac95aa-c63c-41b2-a04b-e0703c159732.png">
<img width="853" alt="Zrzut ekranu 2022-11-17 o 02 02 09" src="https://user-images.githubusercontent.com/26087070/202328599-2e27b83f-e850-4ad7-9d2f-084e05269ced.png">
<img width="853" alt="Zrzut ekranu 2022-11-17 o 02 02 52" src="https://user-images.githubusercontent.com/26087070/202328590-d9afa4e1-660f-4175-abed-f20ccc34e9c2.png">

## Do I have to declare values on initialisation?

You actually don't. Those values just helps TypeScript to infer
the types of your data, so you don't need to create any types for them manually. But if you prefer to declare a types manually, then you can pass the type directly as a generic into the PubSub class like here:

```ts
import { PubSub } from '@kamyil/typed-pubsub';

type TEvents = {
  'user:registered': { firstName: string, lastName: string, age: number },
  'age:changed': number,
  'firstName:changed': string,
  'lastName:changed': string
}

const pubSub = new PubSub<TEvents>({ 
  events: {} as TEvents
});
```

**But remember that you don't need to do it, since TypeScript will nicely auto infer everything from your usage :)**

## ... so do the values even matter?
**Their only role and purpose is to give TypeScript informations to infer, to allow you to have nice type checking, type inference, error validation and autocompletion.**
As mentioned in previous point, you can even pass the empty object there and it will work in the runtime, but you will loose all of those convinient TypeScript features.
If you prefer to declare events and data model as a types - not runtime values, you can declare them like in example in previous point:
[Do I have to declare values on initialisation?](#do-i-have-to-declare-values-on-initialisation)

## Performance test
You can check how this library is performing by checking this link: https://stackblitz.com/edit/typescript-v2k7gx?file=index.ts
Test essentially creates new subscriber on every 10ms, while updating value to all subscribers on every 20ms

## Optional logging

For debugging purposes you can enable non-verbose logs

```ts
const pubSub = new PubSub({ 
  events: Events, 
  logs: true 
});
```

## Using it with JavaScript

You can also use this library in normal JavaScript files. If you're using VSCode, you should also have type autocompletion enabled by default, even in JS files

## What is PubSub?

`PubSub` is extremely common `publish-subscribe` design pattern that allows you to listen on specific events and retrieve data. Every time you call the `.publish()` of specific event with some data passed in there, every listener to that event will receive the call and the data you've passed.
You can get more info about this here:
<https://www.enjoyalgorithms.com/blog/publisher-subscriber-pattern>

## In which way this library is blazingly fast?

1. In compare to other PubSub libraries, this one does not store event listeners in the `Map`, `Array` or `Set` but simple object instead with following model:

```ts
{
  'event1': {
    1: { eventHandler: someSpecificCallback },
    2: { eventHandler: differentCallback },
    // etc.
  },
  'event2': {
    1: { eventHandler: someSpecificCallback },
    2: { eventHandler: differentCallback },
    // etc.
  }
  // etc.
}
```
It's made this way, because objects are the best store dictionaries for performing heavy reads, since JavaScript engines compile them down
to C++ classes which later are being cached.
As it's stated here: https://stackoverflow.com/a/49164774

`So if you have a write-once read-heavy workload with string keys then you can use an object as a high-performance dictionary`

Since PubSub is a pattern where there are not a lot of writes, but there is actually a heavy reading (by using string keys) from it, object seems to be a perfect fit

2. Also getting all subscribed event listeners is not performed by using `Array.filter()` or `Array.find()` but rather by pointing directly into concrete object, where eventName is a key. So there are no unnecessary loops going on while finding all subscribed event listeners

## I would like to extend the functionality of it

Since it's a simple class, you can easily extend it by using an `extends` keyword

```ts
export class CustomPubSub extends PubSub {
  someNewProperty = '';
  someNewFuntionality() {
    // ...
  }
}
```

## How to unsubscribe?

Every `subscribe()` call returns an `unsubscribe()` function

```ts
  const pubSub = new PubSub({events: {testEvent: ''}});

  // you can name it whatever you want
  const unsubscribeTestEvent = pubSub.subscribe('testEvent', () => { /* ... */ });

  // and you can call it whenever you want
  unsubscribeTestEvent();
```
It's made this way, because this returned unsubsribe function contains id of given event listener
so it's the most proper way to remove this specific listener from the memory

## I want to subscribe for one event publish only
 
You can also set a subscribe listener for only one event publish if needed

```ts
const pubSub = new PubSub({ events: { testEvent: '' }});

pubSub.subscribeForOnePublishOnly('testEvent', (data) => {/** some callback with data */});
```

## I want to remove/clear all subscribers

You can do it by using `removeAllSubscribers()` method

```ts
pubSub.removeAllSubscribers();
```

## I want to remove subscribers from specific event
You can do it by using `removeAllSubscribersFromEvent(eventName)` method,
where you can pass the event name as parameter and it will remove all listeners
of that event

```ts
pubSub.removeAllSubscribersFromEvent('name of your event');
```
