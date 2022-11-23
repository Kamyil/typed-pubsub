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
  - [Do I have to declare values on initialization?](#do-i-have-to-declare-values-on-initialization)
  - [... so do the values even matter?](#-so-do-the-values-even-matter)
  - [Performance test](#performance-test)
  - [Optional logging](#optional-logging)
  - [Using it with JavaScript](#using-it-with-javascript)
  - [What is PubSub?](#what-is-pubsub)
  - [In which way this library is blazingly fast?](#in-which-way-this-library-is-blazingly-fast)
  - [I want to unsubscribe specific subscriber. How to do it?](#i-want-to-unsubscribe-specific-subscriber-how-to-do-it)
  - [I want to subscribe for one event publish only](#i-want-to-subscribe-for-one-event-publish-only)
  - [I want to clear all subscribers](#i-want-to-clear-all-subscribers)
  - [I want to clear subscribers from specific event](#i-want-to-clear-subscribers-from-specific-event)
  - [I want to check if there are any active subscribers for specific event](#i-want-to-check-if-there-are-any-active-subscribers-for-specific-event)
  - [I prefer other method names like f.e. `emit()` \& `listen()` rather than `publish()` \& `subscribe()`](#i-prefer-other-method-names-like-fe-emit--listen-rather-than-publish--subscribe)
  - [I want to publish/subscribe asynchronously. How to do it?](#i-want-to-publishsubscribe-asynchronously-how-to-do-it)
  - [I want to extend the functionality of it](#i-want-to-extend-the-functionality-of-it)
  - [I want to count how many subscribers specific event has](#i-want-to-count-how-many-subscribers-specific-event-has)

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

3. Create `PubSub` instance with `events` passed

```ts
// 1
import { PubSub } from '@kamyil/typed-pubsub';
// 2
const events = {
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

## Do I have to declare values on initialization?

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
[Do I have to declare values on initialization?](#do-i-have-to-declare-values-on-initialization)

## Performance test

You can check how this library is performing by checking this link: <https://stackblitz.com/edit/typescript-v2k7gx?file=index.ts>
Test essentially creates new subscriber on every 10ms, while updating value to all subscribers on every 20ms

## Optional logging

For debugging purposes you can enable non-verbose logs

```ts
const pubSub = new PubSub({ 
  events: Events, 
  enableLogs: true 
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

## I want to unsubscribe specific subscriber. How to do it?

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

## I want to clear all subscribers

You can do it by using `clearAllSubscribers()` method

```ts
pubSub.clearAllSubscribers();
```

## I want to clear subscribers from specific event

You can do it by using `clearAllSubscribersFromEvent(eventName)` method,
where you can pass the event name as parameter and it will clear all listeners
of that event

```ts
pubSub.clearAllSubscribersFromEvent('name of your event');
```

## I want to check if there are any active subscribers for specific event

You can do it by using `hasSubscribers()` method, which returns `true` if there are subscribers
for passed eventName, and `false` if not.

```ts
pubSub.hasSubscribers('name of your event');
```

## I prefer other method names like f.e. `emit()` & `listen()` rather than `publish()` & `subscribe()`

Since this library relies hardly on types, it's hard to add some method rename function,
because even if you could run such rename() and start using f.e. `pubSub.listen()` or `pubSub.emit()` in the runtime,
it unfortunetly wouldn't work properly for types, since TS cannot resolve types dynamically
depending on your runtime usage. So the solution here *(not-ideal but it somewhat solves the problem)*
would be to create new class that extends this class and remap the names like so:

```ts
import { PubSub } from '@kamyil/typed-pubsub';

// Remember to add and pass generic here, to let type inference keep working properly
class EventEmitter<Events> extends PubSub<Events> {
  emit = this.publish;
  listen = this.subscribe;
  hasListeners = this.hasSubscribers;
  //... and so on
}
```

Solution is far from ideal, because you will still get `publish()` and `subscribe()` and other
non-renamed methods in the autocompletion, but at least you will also be able to use those methods
with a new names that you set which fits your preference, while keeping same functionality (in both types and fast execution in the runtime)
Probably the better solution would be to copy the source code from `index.ts`, since whole functionality self-contained within one file and
rename the methods manually. But if you want to get updates, you will also need to manually update the new code within your copied file
If you like this library and decide to copy the source code, please at least leave a star on GitHub or install&uninstall it via npm - it will make me sure 
that this library is used by people and it makes sense to further develop it :)

## I want to publish/subscribe asynchronously. How to do it?

Since it doesn't make really sense for `subscribe()` to be async, it is designed to be synchronous only.
If you want to await for some things within subscribe, you can simply mark it's callback/eventHandler as async

```ts
pubSub.subscribe('someEvent', async () => {
  await something();
});
```

However, it is not the case for publish, since there might be some edgy cases where you would want to "pause" further code execution
to be completely sure that your `publish()` call will be noticed by all subscribers
and all of those subscribers will perform their callbacks before code runs further.
`publish()` method has it's async equivalent named `publishAsync()`
It also accepts eventName and data as it's arguments, but in opposite to normal synchronous `publish()` it also returns
boolean, that indicates if publish finished successfully, which means - it found all of it's subscribers and all of them
finished their callbacks
**Example:**

```ts
async function onDataFetched(data) {
  const isDataPublished = await pubSub.publishAsync('data:fetched', data);
  if (isDataPublished) {
    await doSomethingAfterThePublishIsComplete();
    await doSomethingElseAfterThePublishIsComplete();
  }
}

```

## I want to extend the functionality of it

Since it's a simple class, you can easily extend it by using an `extends` keyword

```ts
export class CustomPubSub extends PubSub {
  someNewProperty = '';
  someNewFunctionality() {
    // ...
  }
}
```

## I want to count how many subscribers specific event has

You can do it by using `countSubscribers()` method

```ts

pubSub.subscribe('someEvent', () => {});
pubSub.subscribe('someEvent', () => {});

const subsAmount = pubSub.countSubscribers();
console.log(subsAmount) // => 2
```
