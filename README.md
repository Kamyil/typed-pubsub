# Typed PubSub

- [Typed PubSub](#typed-pubsub)
  - [How to use it?](#how-to-use-it)
  - [Do I have to declare values on initialisation?](#do-i-have-to-declare-values-on-initialisation)
  - [Optional logging](#optional-logging)
  - [JavaScript only](#javascript-only)

Typical **PubSub**, **EventBus**, **EventEmitter** (whatever you call it), that you can expect, but **fully** and **hardly** typed which means
that you will be able to get all autocomplete and autovalidation
TypeScript features in your typical PubSub

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

const Events: TEvents = {
  "user:registered": {
    firstName: "",
    lastName: "",
    age: 0
  },
  "age:changed": 0,
  "firstName:changed": "",
  "lastName:changed": ""
};

const pubSub = new PubSub<TEvents>({ 
  events: Events 
});
```

**But remember that you don't need to do it, since TypeScript will nicely auto infer everything from your usage :)**

## Optional logging

For debugging purposes you can enable non-verbose logs

```ts
const pubSub = new PubSub({ 
  events: Events, 
  logs: true 
});
```

## JavaScript only

You can also use this library in normal JavaScript files. If you're using VSCode, you should also have type-checking enabled by default, even in JS files
