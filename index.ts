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

  publish<EventName extends keyof Events, EventData extends Events[EventName]>(
    eventName: EventName,
    data?: EventData
  ): void | Error {
    const amountOfListenersOfThisEvent = Object.keys(this.listeners[eventName as string]).length;

    if (amountOfListenersOfThisEvent !== 0) {
      for (let id = 1; id <= amountOfListenersOfThisEvent; id++) {
        this.listeners[eventName as string][id].eventHandler(data);
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
  >(eventName: EventName, eventHandler: (data: EventData) => void): void {
    let listenersOfThisEvent = this.listeners[eventName as string];

    if (listenersOfThisEvent) {
      const newListenerIndex = Number(Object.keys(listenersOfThisEvent).length + 1);
      listenersOfThisEvent[newListenerIndex] = {
        eventHandler: eventHandler
      };
    } else {
      this.listeners[eventName as string] = {};
      this.listeners[eventName as string][1] = {
        eventHandler: eventHandler
      };
    } 
  }
}