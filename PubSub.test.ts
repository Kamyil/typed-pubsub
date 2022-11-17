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
});
