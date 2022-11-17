export class PubSub<Events> {
  private listeners: {
    subscribedEventName: keyof Events;
    eventHandler: (data: any) => void;
  }[] = [];
  protected events!: Events;
  private logs!: boolean;

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
    data: EventData
  ): void | Error {
    const listeners = this.listeners.filter(
      (listener) => listener.subscribedEventName === eventName
    );
    if (listeners.length !== 0) {
      listeners.forEach((listener) => listener.eventHandler(data));
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
    this.listeners.push({
      subscribedEventName: eventName,
      eventHandler,
    });
  }
}