type UnsubscribeFunction = () => void;
type Options<Events> = {
  events: Events; 
  logs?: boolean;
}

export class PubSub<Events> {
  protected listeners: Record<string, {[id: number]: {
    eventHandler: (data: any) => void;
    forOneEventOnly: boolean;
  }}> = {};
  protected events!: Events;
  protected logs!: boolean;
  
  /**
   * Initializes `PubSub` instance
   * @param Options
   */
  constructor({ events, logs = false }: Options<Events>) {
    if (events) this.events = events;
    else
      console.error(
        "ERROR in PubSub: Events were not passed when initializing class"
      );

    if (logs) this.logs = logs;
  }

  /**
   * Publishes the specified event with data
   * @param eventName name of the event
   * @param data 
   */
  publish<
    EventName extends keyof Events, 
    EventData extends Events[EventName]
  >(
    eventName: EventName,
    data?: EventData
  ): void {
    const listenersOfThisEvent = this.listeners[eventName as string];

    if (Object.keys(listenersOfThisEvent).length !== 0) {
      for (let listener in listenersOfThisEvent) {
        listenersOfThisEvent[listener].eventHandler(data);
        if (listenersOfThisEvent[listener].forOneEventOnly) {
          delete listenersOfThisEvent[listener];
        }
      }
    } else {
      if (this.logs) {
        console.log(`No listeners found for eventName: ${String(eventName)}`);
      }
    }
  }

  /**
   * Subscribes to defined event. Every time when this specific event will be published
   * the eventHandler will be called 
   * @param eventName The name of event
   * @param eventHandler callback that will perform on every event publish
   * @returns Function that allows this subscribe listener to unsubscribe 
   */
  subscribe<
    EventName extends keyof Events,
    EventData extends Events[EventName]
  >(eventName: EventName, eventHandler: (data: EventData) => void): UnsubscribeFunction {
    let listenersOfThisEvent = this.listeners[eventName as string];
    let newListenerIndex: number;

    if (listenersOfThisEvent) {
      newListenerIndex = Number(Object.keys(listenersOfThisEvent).length + 1);
    } else {
      newListenerIndex = 1;
      this.listeners[eventName as string] = {};
    }

    this.listeners[eventName as string][newListenerIndex] = {
      eventHandler: eventHandler,
      forOneEventOnly: false
    };

    const unsubscribeHandler = () => {
      delete this.listeners[eventName as string][newListenerIndex];
    };
    
    return unsubscribeHandler;
  }

  /**
   * Subscribes for one event publish only
   * @param eventName The name of event
   * @param eventHandler callback that will perform on every event publish
   */
  subscribeForOnePublishOnly<
    EventName extends keyof Events,
    EventData extends Events[EventName]
  >(eventName: EventName, eventHandler: (data: EventData) => void) {
    let listenersOfThisEvent = this.listeners[eventName as string];
    let newListenerIndex: number;

    if (listenersOfThisEvent) {
      newListenerIndex = Number(Object.keys(listenersOfThisEvent).length + 1);
    } else {
      newListenerIndex = 1;
      this.listeners[eventName as string] = {};
    }

    this.listeners[eventName as string][newListenerIndex] = {
      eventHandler: eventHandler,
      forOneEventOnly: true,
    };
  }
}