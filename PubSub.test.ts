import { PubSub } from './index';

describe('PubSub', () => {
  it(`should properly subscribe to given event`, () => {
    const pubSub = new PubSub({events: {testEvent: ''}});
    const eventCallback1 = jest.fn();
    const eventCallback2 = jest.fn();
    const eventCallback3 = jest.fn();

    pubSub.subscribe('testEvent', eventCallback1);
    pubSub.subscribe('testEvent', eventCallback2);
    pubSub.subscribe('testEvent', eventCallback3);

    pubSub.publish('testEvent');
    pubSub.publish('testEvent');
    pubSub.publish('testEvent');

    expect(eventCallback1).toBeCalledTimes(3);
    
    expect(eventCallback2).toBeCalledTimes(3);
    expect(eventCallback3).toBeCalledTimes(3);

    pubSub.publish('testEvent');
    pubSub.publish('testEvent');
    pubSub.publish('testEvent');

    expect(eventCallback1).toBeCalledTimes(6);
    expect(eventCallback2).toBeCalledTimes(6);
    expect(eventCallback3).toBeCalledTimes(6);
  });

  it(`should check if data that is being published
   is the same for all subscribers`, () => {
    const pubSub = new PubSub({events: {testEvent: 2}});
    const eventCallback1 = jest.fn();
    const eventCallback2 = jest.fn();
    const eventCallback3 = jest.fn();
    
    pubSub.subscribe('testEvent', eventCallback1);
    pubSub.subscribe('testEvent', eventCallback2);
    pubSub.subscribe('testEvent', eventCallback3);

    pubSub.publish('testEvent', 2);

    expect(eventCallback1).toBeCalledWith(2);
    expect(eventCallback2).toBeCalledWith(2);
    expect(eventCallback3).toBeCalledWith(2);

    pubSub.publish('testEvent', 3);
  });

  it('should allow to unsubscribe given subscribe call', () => {
    const pubSub = new PubSub({events: {testEvent: ''}});

    const eventCallback1 = jest.fn();
    const eventCallback2 = jest.fn();
    const eventCallback3 = jest.fn();

    const unsubscribeEvent1 = pubSub.subscribe('testEvent', eventCallback1);
    pubSub.subscribe('testEvent', eventCallback2);
    pubSub.subscribe('testEvent', eventCallback3);

    pubSub.publish('testEvent');
    pubSub.publish('testEvent');
    pubSub.publish('testEvent');

    expect(eventCallback1).toBeCalledTimes(3);
    expect(eventCallback2).toBeCalledTimes(3);
    expect(eventCallback3).toBeCalledTimes(3);

    unsubscribeEvent1();

    pubSub.publish('testEvent');
    pubSub.publish('testEvent');
    pubSub.publish('testEvent');

    expect(eventCallback1).toBeCalledTimes(3);
    expect(eventCallback2).toBeCalledTimes(6);
    expect(eventCallback3).toBeCalledTimes(6);
  });

  it('should subscribe for one event only and remove listener afterwards', () => {
    const pubSub = new PubSub({events: {testEvent: ''}});

    const eventCallback1 = jest.fn();
    const eventCallback2 = jest.fn();
    const eventCallback3 = jest.fn();

    pubSub.subscribeForOnePublishOnly('testEvent', eventCallback1);
    pubSub.subscribe('testEvent', eventCallback2);
    pubSub.subscribe('testEvent', eventCallback3);

    pubSub.publish('testEvent');
    pubSub.publish('testEvent');
    pubSub.publish('testEvent');

    expect(eventCallback1).toBeCalledTimes(1);
    expect(eventCallback2).toBeCalledTimes(3);
    expect(eventCallback3).toBeCalledTimes(3);


    pubSub.publish('testEvent');
    pubSub.publish('testEvent');
    pubSub.publish('testEvent');

    expect(eventCallback1).toBeCalledTimes(1);
    expect(eventCallback2).toBeCalledTimes(6);
    expect(eventCallback3).toBeCalledTimes(6);

    expect(pubSub['subscribers']['testEvent']['1']).not.toBeDefined();
    expect(pubSub['subscribers']['testEvent']['2']).toBeDefined();
    expect(pubSub['subscribers']['testEvent']['3']).toBeDefined();
  });

  it('should allow user to clear all currently subscribed listeners', () => {
    const NO_LISTENERS_FOUND_MSG = 'No listeners found for eventName: testEvent';
    const pubSub = new PubSub({events: {testEvent: ''}, enableLogs: true });
    console.log = jest.fn();

    const eventCallback1 = jest.fn();
    const eventCallback2 = jest.fn();
    const eventCallback3 = jest.fn();

    pubSub.subscribe('testEvent', eventCallback1);
    pubSub.subscribe('testEvent', eventCallback2);
    pubSub.subscribe('testEvent', eventCallback3);

    pubSub.publish('testEvent');
    pubSub.publish('testEvent');
    pubSub.publish('testEvent');

    expect(eventCallback1).toBeCalledTimes(3);
    expect(eventCallback2).toBeCalledTimes(3);
    expect(eventCallback3).toBeCalledTimes(3);

    pubSub.clearAllSubscribers();
    pubSub.publish('testEvent');
    pubSub.publish('testEvent');
    pubSub.publish('testEvent');
    
    expect(eventCallback1).toBeCalledTimes(3);
    expect(eventCallback2).toBeCalledTimes(3);
    expect(eventCallback3).toBeCalledTimes(3);
    
    expect(pubSub['subscribers']).toStrictEqual({});
    expect(console.log).toBeCalledTimes(3);
    expect(console.log).toHaveBeenCalledWith(NO_LISTENERS_FOUND_MSG);
  });

  it('should allow user to clear specific subscribers', () => {
    const NO_LISTENERS_FOUND_MSG = 'No listeners found for eventName: testEvent2';
    const pubSub = new PubSub({
      events: {
        testEvent: "",
        testEvent2: "",
      },
      enableLogs: true,
    });
    console.log = jest.fn();

    const eventCallback1 = jest.fn();
    const eventCallback2 = jest.fn();
    const eventCallback3 = jest.fn();

    pubSub.subscribe('testEvent', eventCallback1);
    pubSub.subscribe('testEvent2', eventCallback2);
    pubSub.subscribe('testEvent2', eventCallback3);

    pubSub.publish('testEvent');
    pubSub.publish('testEvent2');
    pubSub.publish('testEvent2');

    expect(eventCallback1).toBeCalledTimes(1);
    expect(eventCallback2).toBeCalledTimes(2);
    expect(eventCallback3).toBeCalledTimes(2);

    pubSub.clearAllSubscribersFromEvent('testEvent2');
    pubSub.publish('testEvent');
    pubSub.publish('testEvent2');
    pubSub.publish('testEvent2');
    
    expect(eventCallback1).toBeCalledTimes(2);
    expect(eventCallback2).toBeCalledTimes(2);
    expect(eventCallback3).toBeCalledTimes(2);
    
    // @ts-ignore
    expect(pubSub['subscribers']['testEvent2']).toStrictEqual(undefined);
    expect(console.log).toBeCalledTimes(2);
    expect(console.log).toHaveBeenCalledWith(NO_LISTENERS_FOUND_MSG);
  });

  it('should allow user to check if event has any active listeners', () => {
    const pubSub = new PubSub({
      events: {
        testEvent: () => {},
        testEvent2: () => {},
      },
    });

    const unsubscribeTestEvent1 = pubSub.subscribe('testEvent', () => {});
    pubSub.subscribe('testEvent2', () => {});

    unsubscribeTestEvent1();

    expect(pubSub.hasSubscribers('testEvent')).toBe(false);
    expect(pubSub.hasSubscribers('testEvent2')).toBe(true);
  });

  it('should allow user to publish events asynchronously and NOT await for all subscribers to finish before returning the status and resolving Promise', async () => {
    console.log = jest.fn();
    const pubSub = new PubSub({
      events: {
        testEvent1: '',
        testEvent2: '',
      },
    });

    const promiseToResolve = (callback: () => void) => new Promise((resolve) => {
      setTimeout(() => {
        callback();
        resolve(true);
      }, Infinity)
    });

    pubSub.subscribe('testEvent1', () => promiseToResolve(() => console.log('testEvent1')));
    pubSub.subscribe('testEvent2', () => promiseToResolve(() => console.log('testEvent2')));

    const hasPublishedTestEvent1 = await pubSub.publishAsync('testEvent1', 'some data', {
      awaitAllSubscribersFinish: false
    });

    expect(hasPublishedTestEvent1).toBe(true);
    // @ts-ignore - intentional check if it works in runtime as well
    const hasPublishedNonValidEvent = await pubSub.publishAsync('nonValidEvent', 'some data', {
      awaitAllSubscribersFinish: false
    });

    expect(hasPublishedNonValidEvent).toBe(false);
    expect(console.log).not.toBeCalled();

    const hasPublishedTestEvent2 = await pubSub.publishAsync('testEvent2', 'some data', {
      awaitAllSubscribersFinish: false
    });

    expect(hasPublishedTestEvent2).toBe(true);
    expect(console.log).not.toBeCalledWith('testEvent2');
    expect(console.log).not.toBeCalledTimes(2);
  });

  it('should allow user to publish events asynchronously and await for all subscribers to finish before returning the status and resolving Promise', async () => {
    console.log = jest.fn();
    const pubSub = new PubSub({
      events: {
        testEvent1: '',
        testEvent2: '',
      },
    });

    const promiseToResolve = (callback: () => void) => new Promise((resolve) => {
      setTimeout(() => {
        callback();
        resolve(true);
      }, 1000)
    });

    pubSub.subscribe('testEvent1', () => promiseToResolve(() => console.log('testEvent1')));
    pubSub.subscribe('testEvent2', () => promiseToResolve(() => console.log('testEvent2')));

    const hasPublishedTestEvent1 = await pubSub.publishAsync('testEvent1', 'some data');

    expect(hasPublishedTestEvent1).toBe(true);
    // @ts-ignore - intentional check if it works in runtime as well
    const hasPublishedNonValidEvent = await pubSub.publishAsync('nonValidEvent', 'some data');

    expect(hasPublishedNonValidEvent).toBe(false);
    expect(console.log).toBeCalled();
    expect(console.log).toBeCalledWith('testEvent1');

    const hasPublishedTestEvent2 = await pubSub.publishAsync('testEvent2', 'some data', {
      awaitAllSubscribersFinish: false
    });

    expect(hasPublishedTestEvent2).toBe(true);
    expect(console.log).toBeCalledWith('testEvent2');
    expect(console.log).toBeCalledTimes(3);
  });

  it('should allow user to count how many subscribers specific event has', () => {
    const pubSub = new PubSub({
      events: {
        testEvent1: '',
        testEvent2: '',
      },
    });

    const unsubscribeTestEvent1 = pubSub.subscribe('testEvent1', () => {});
    pubSub.subscribe('testEvent1', () => {});
    pubSub.subscribe('testEvent1', () => {});
    pubSub.subscribe('testEvent1', () => {});
    pubSub.subscribe('testEvent1', () => {});
    pubSub.subscribe('testEvent1', () => {});
    const unsubscribeTestEvent2 = pubSub.subscribe('testEvent2', () => {});

    expect(pubSub.countSubscribers('testEvent1')).toBe(6);
    expect(pubSub.countSubscribers('testEvent2')).toBe(1);

    unsubscribeTestEvent2();
    unsubscribeTestEvent1();

    expect(pubSub.countSubscribers('testEvent1')).toBe(5);
    expect(pubSub.countSubscribers('testEvent2')).toBe(0);
  });
});
