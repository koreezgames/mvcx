export function logCommand(consoleArgs: string[], notificationName: string, commandName: string): void {
    consoleArgs[0] = `%c %c %c ${notificationName} =>  ${commandName} %c %c `;
    console.log.apply(console, consoleArgs);
}

export function logNotification(consoleArgs: string[], notificationName: string): void {
    consoleArgs[0] = `%c %c %c ${notificationName} %c %c `;
    console.log.apply(console, consoleArgs);
}

export function logMediator(consoleArgs: string[], name: string, action: string): void {
    consoleArgs[0] = `%c %c %c ${name}: ${action} %c %c `;
    console.log.apply(console, consoleArgs);
}

export function logProxy(consoleArgs: string[], name: string, action: string): void {
    consoleArgs[0] = `%c %c %c ${name}: ${action} %c %c `;
    console.log.apply(console, consoleArgs);
}

export function logNone(...args: any[]): void {}

export class MVCMap<T> {
    private __map: any;

    constructor() {
        this.__map = new Object();
    }

    public set(key: string, value: T): void {
        this.__map[key] = value;
    }

    public get(key: string): T {
        return this.__map[key];
    }

    public has(key: string): boolean {
        return !!this.__map[key];
    }

    public delete(key: string): T {
        const value = this.__map[key];
        delete this.__map[key];
        return value;
    }

    public forEach(fn: (key: string, value?: T) => any): void {
        for (const key in this.__map) {
            if (this.hasOwnProperty(key)) {
                fn(key, this.__map[key]);
            }
        }
    }
}
