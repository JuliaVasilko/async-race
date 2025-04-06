export class EventEmitter {
  private events: { [key: string]: Function[] } = {};

  subscribe(eventName: string, callback: Function): void {
    !this.events[eventName] && (this.events[eventName] = []);
    this.events[eventName].push(callback);
  }

  unsubscribe(eventName: string, callback: Function): void {
    this.events[eventName] = this.events[eventName].filter(eventCallback => callback !== eventCallback);
  }

  emit<T>(eventName: string, args?: T): void {
    const event = this.events[eventName];
    event && event.forEach(callback => callback(args));
  }
}

export const eventEmitter = new EventEmitter();
