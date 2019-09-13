export function logCommand(consoleArgs: string[], notificationName: string, commandName: string): void {
    consoleArgs[0] = `%c %c %c ${notificationName} =>  ${commandName} %c %c `;
    console.log.apply(console, consoleArgs);
}

export function logNotification(consoleArgs: string[], notificationName: string): void {
    consoleArgs[0] = `%c %c %c ${notificationName} %c %c `;
    console.log.apply(console, consoleArgs);
}

export function logObservant(consoleArgs: string[], name: string, action: string): void {
    consoleArgs[0] = `%c %c %c ${name}: ${action} %c %c `;
    console.log.apply(console, consoleArgs);
}

export function logProxy(consoleArgs: string[], name: string, action: string): void {
    consoleArgs[0] = `%c %c %c ${name}: ${action} %c %c `;
    console.log.apply(console, consoleArgs);
}

export function logNone(...args: any[]): void {}

export class MVCMap<K, V> {
    private __keys: K[];
    private __values: V[];

    constructor() {
        this.__keys = [];
        this.__values = [];
    }

    public get keys(): K[] {
        return this.__keys;
    }

    public get values(): V[] {
        return this.__values;
    }

    public set(key: K, value: V): void {
        this.__keys.push(key);
        this.__values.push(value);
    }

    public get(key: K): V {
        const index = this.__keys.indexOf(key);
        if (index !== -1) {
            return this.__values[index];
        }
        return undefined;
    }

    public has(key: K): boolean {
        return this.__keys.indexOf(key) !== -1;
    }

    public delete(key: K): V {
        const index = this.__keys.indexOf(key);
        if (index !== -1) {
            const value = this.__values[index];
            this.__keys.splice(index, 1);
            this.__values.splice(index, 1);
            return value;
        }
        return undefined;
    }

    public forEach(fn: (key: K, value?: V) => any): void {
        const keys = this.__keys;
        let i = keys.length - 1;
        while (i > -1) {
            fn(this.__keys[i], this.__values[i]);
            i -= 1;
        }
    }
}
