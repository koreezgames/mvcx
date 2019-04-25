import { Facade } from "./Facade";
import { Observant } from "./Observant";
import { MVCMap } from "./utils";

export class Observer {
    protected _facade: Facade;
    protected _notificationToObservantsMap: MVCMap<string[]>;
    protected _observantsMap: MVCMap<Observant>;
    protected _sleptObservantsMap: MVCMap<Observant>;

    constructor(facade: Facade) {
        this._facade = facade;
        this._notificationToObservantsMap = new MVCMap();
        this._observantsMap = new MVCMap();
        this._sleptObservantsMap = new MVCMap();
    }

    public registerObservant<O extends Observant>(observant: new () => O): void {
        if (this.hasObservant(observant) || this.hasSleptObservant(observant)) {
            return;
        }
        const name = observant.name;
        const observantInstance = new observant();
        this._observantsMap.set(name, observantInstance);
        observantInstance.onRegister(this._facade, this._onSubscriptionChange);
    }

    public removeObservant<O extends Observant>(observant: new () => O): void {
        if (this.hasObservant(observant)) {
            Observer.__removeObservant(this._observantsMap, observant);
            return;
        }
        if (this.hasSleptObservant(observant)) {
            Observer.__removeObservant(this._sleptObservantsMap, observant);
        }
    }

    public retrieveObservant<O extends Observant>(observant: new () => O): O {
        return this._observantsMap.get(observant.name) as O;
    }

    public hasObservant<O extends Observant>(observant: new () => O): boolean {
        return this._observantsMap.has(observant.name);
    }

    public hasSleptObservant<O extends Observant>(observant: new () => O): boolean {
        return this._sleptObservantsMap.has(observant.name);
    }

    public sleepObservant<O extends Observant>(observant: new () => O): void {
        if (!this.hasObservant(observant)) {
            return;
        }

        const key = observant.name;
        let observantInstance = this._observantsMap.get(key);
        this._sleptObservantsMap.set(key, observantInstance);
        this._observantsMap.delete(key);
        observantInstance.onSleep();
    }

    public wakeObservant<O extends Observant>(observant: new () => O): void {
        if (!this.hasSleptObservant(observant)) {
            return;
        }

        const key = observant.name;
        let observantInstance = this._sleptObservantsMap.get(key);
        this._observantsMap.set(key, observantInstance);
        this._sleptObservantsMap.delete(key);
        observantInstance.onWake();
    }

    public handleNotification(notification: string, ...args: any[]): void {
        if (this.__hasNotification(notification)) {
            const observantNames = this._notificationToObservantsMap.get(notification);
            observantNames.forEach((observantName: string) => {
                const observant = this._observantsMap.get(observantName);
                observant.onNotification(notification, ...args);
            });
        }
    }

    protected _onSubscriptionChange = (notification: string, observantName: string, subscribe: boolean) => {
        subscribe ? this.__subscribe(notification, observantName) : this.__unsubscribe(notification, observantName);
    };

    private __subscribe(notification: string, observantName: string): void {
        if (!this.__hasNotification(notification)) {
            this._notificationToObservantsMap.set(notification, [observantName]);
        } else {
            const names = this._notificationToObservantsMap.get(notification);
            const existing = names.indexOf(observantName);
            if (existing !== -1) {
                names[existing] = observantName;
            } else {
                names.push(observantName);
            }
        }
    }

    private __unsubscribe(notification: string, observantName: string): void {
        if (!this.__hasNotification(notification)) {
            return;
        }

        const names = this._notificationToObservantsMap.get(notification);
        const existing = names.indexOf(observantName);
        if (existing !== -1) {
            names.splice(existing, 1);
            if (!names.length) {
                this._notificationToObservantsMap.delete(notification);
            }
        }
    }

    private __hasNotification(key: string): boolean {
        return this._notificationToObservantsMap.has(key);
    }

    private static __removeObservant<O extends Observant>(map: MVCMap<Observant>, observant: new () => O): void {
        const key = observant.name;
        let observantInstance = map.get(key);
        map.delete(key);
        observantInstance.onRemove();
    }
}
