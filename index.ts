type UnsubscribeFunction = () => void;

export class PubSub<Events> {
  protected listeners: Record<string, {[id: number]: {
    eventHandler: (data: any) => void;
  }}> = {};
  protected events!: Events;
  protected logs!: boolean;
  
  constructor({ events, logs = false }: { events: Events; logs?: boolean }) {
    if (events) this.events = events;
    else
      console.error(
        "ERROR in PubSub: Events were not passed when initializing class"
      );

    if (logs) this.logs = logs;
  }

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
      }
    } else {
      if (this.logs) {
        console.log(`No listeners found for eventName: ${String(eventName)}`);
      }
    }
  }

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
      eventHandler: eventHandler
    };

    const unsubscribeHandler = () => {
      delete this.listeners[eventName as string][newListenerIndex];
    };
    
    return unsubscribeHandler;
  }
}