type Subscriber = {
  [id: number]: {
    eventHandler: (data: any) => void;
    forOneEventOnly: boolean;
  };
};
type Subscribers = Record<string, Subscriber>;
type UnsubscribeFunction = () => void;
type Options<Events> = {
  events: Events;
  enableLogs?: boolean;
};

export class PubSub<Events> {
  protected subscribers: Subscribers = {};
  protected events!: Events;
  protected enableLogs!: boolean;

  /**
   * Initializes `PubSub` instance
   * @param Options
   */
  constructor({ events, enableLogs = false }: Options<Events>) {
    if (events) this.events = events;
    else {
      console.log(
        "Warning in PubSub: Events were not passed when initializing class"
      );
    }

    if (enableLogs) this.enableLogs = enableLogs;
  }

  /**
   * Publishes the specified event with data
   * @param eventName name of the event
   * @param data
   */
  publish<EventName extends keyof Events, EventData extends Events[EventName]>(
    eventName: EventName,
    data?: EventData
  ): void {
    const subscribersOfThisEvent = this.subscribers[eventName as string];
    let subscribersAmount: number;

    if (subscribersOfThisEvent) {
      subscribersAmount = Object.keys(subscribersOfThisEvent).length;
    } else subscribersAmount = 0;

    if (subscribersAmount === 0) {
      if (this.enableLogs) {
        console.log(`No listeners found for eventName: ${String(eventName)}`);
        return;
      }
    }

    for (let subscriber in subscribersOfThisEvent) {
      subscribersOfThisEvent[subscriber].eventHandler(data);

      if (subscribersOfThisEvent[subscriber].forOneEventOnly) {
        delete subscribersOfThisEvent[subscriber];
      }
    }
  }

  /**
   * Allows to publish event asynchronously, which makes sure that no further code will be executed
   * until all subscribers receive your event publish
   * @param eventName name of the event you want to publish
   * @param data data that will come with this event publish
   * @returns boolean that indicates if publish went successfully or not
   */
  async publishAsync<
    EventName extends keyof Events,
    EventData extends Events[EventName]
  >(eventName: EventName, data?: EventData): Promise<boolean> {
    try {
      const subscribersOfThisEvent = this.subscribers[eventName as string];
      let subscribersAmount: number;

      if (subscribersOfThisEvent) {
        subscribersAmount = Object.keys(subscribersOfThisEvent).length;
      } else subscribersAmount = 0;

      if (subscribersAmount === 0) {
        if (this.enableLogs) {
          console.log(`No listeners found for eventName: ${String(eventName)}`);
        }

        return false;
      }

      for (let subscriber in subscribersOfThisEvent) {
        subscribersOfThisEvent[subscriber].eventHandler(data);

        if (subscribersOfThisEvent[subscriber].forOneEventOnly) {
          delete subscribersOfThisEvent[subscriber];
        }
      }

      return true;
    } catch (error) {
      if (this.enableLogs) {
        console.error(
          `error when trying to asynchronously publish event:${String(
            eventName
          )}.
Error`,
          error
        );
      }
      return false;
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
  >(
    eventName: EventName,
    eventHandler: (data: EventData) => void
  ): UnsubscribeFunction {
    let subscribersOfThisEvent = this.subscribers[eventName as string];
    let newSubscriberIndex: number;

    if (subscribersOfThisEvent) {
      newSubscriberIndex = Number(
        Object.keys(subscribersOfThisEvent).length + 1
      );
    } else {
      newSubscriberIndex = 1;
      this.subscribers[eventName as string] = {};
    }

    this.subscribers[eventName as string][newSubscriberIndex] = {
      eventHandler: eventHandler,
      forOneEventOnly: false,
    };

    const unsubscribeHandler = () => {
      delete this.subscribers[eventName as string][newSubscriberIndex];
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
  >(eventName: EventName, eventHandler: (data: EventData) => void): void {
    let subscribersOfThisEvent = this.subscribers[eventName as string];
    let newSubscriberIndex: number;

    if (subscribersOfThisEvent) {
      newSubscriberIndex = Number(
        Object.keys(subscribersOfThisEvent).length + 1
      );
    } else {
      newSubscriberIndex = 1;
      this.subscribers[eventName as string] = {};
    }

    this.subscribers[eventName as string][newSubscriberIndex] = {
      eventHandler: eventHandler,
      forOneEventOnly: true,
    };
  }

  /**
   * Removes all subscribers/listeners from memory
   */
  clearAllSubscribers(): void {
    this.subscribers = {} as Subscribers;
  }

  /**
   * Removes subscribers/listeners of specific event from memory
   * @param eventName Name of the event
   */
  clearAllSubscribersFromEvent<EventName extends keyof Events>(
    eventName: EventName
  ): void {
    if (!this.subscribers[eventName as string] && this.enableLogs) {
      console.log(
        `PubSub warning: No subscribers of event=${
          eventName as string
        } found while trying to remove
subscribers from memory`
      );
      return;
    }
    delete this.subscribers[eventName as string];
  }

  /**
   * Checks if given event has any active subscribers/listeners
   * @param eventName
   * 
   * @returns boolean indicating if given event has any active subscribers
   */
  hasSubscribers<EventName extends keyof Events>(
    eventName: EventName
  ): boolean {
    if (Object.keys(this.subscribers[eventName as string]).length > 0) {
      return true;
    }

    return false;
  }

  /**
   * Counts all subscribers that subscribe given specific event
   * It starts counting from 1. 0 means no active subscribers
   * @param eventName name of the event they subscribe
   * 
   * @returns amount of subscribers
   */
   countSubscribers<EventName extends keyof Events>(
    eventName: EventName
  ): number {
    return Object.keys(this.subscribers[eventName as string]).length;
  }
}
