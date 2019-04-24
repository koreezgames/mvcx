import { Facade } from "./Facade";
import { Observant } from "./Observant";
import { MVCMap } from "./utils";

export class Observer {
    protected _facade: Facade;
    protected _notificationToObservantsMap: MVCMap<string[]>;
    protected _observantsMap: MVCMap<Observant>;

    constructor(facade: Facade) {
        this._facade = facade;
        this._notificationToObservantsMap = new MVCMap();
        this._observantsMap = new MVCMap();
    }

    public registerObservant<O extends Observant>(observant: new () => O): void {
        const observantInstance = new observant();
        const name = observantInstance.observantName;
        this._observantsMap.set(name, observantInstance);
        observantInstance.onRegister(this._facade, this._onSubscriptionChange);
    }

    public removeObservant<O extends Observant>(observant: new () => O): void {
        if (!this.hasObservant(observant)) {
            return;
        }

        const key = observant.name;
        let observantInstance = this._observantsMap.get(key);

        this._observantsMap.delete(key);
        observantInstance.onRemove();
    }

    public retrieveObservant<O extends Observant>(mediator: new () => O): O {
        return this._observantsMap.get(mediator.name) as O;
    }

    public hasObservant<O extends Observant>(observant: new () => O): boolean {
        return this._observantsMap.has(observant.name);
    }

    public handleNotification(notification: string, ...args: any[]): void {
        if (this._hasNotification(notification)) {
            const observantNames = this._notificationToObservantsMap.get(notification);
            observantNames.forEach((observantName: string) => {
                const observant = this._observantsMap.get(observantName);
                observant.onNotification(notification, ...args);
            });
        }
    }

    public subscribe(notification: string, observantName: string): void {
        if (!this._hasNotification(notification)) {
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

    public unsubscribe(notification: string, observantName: string): void {
        if (!this._hasNotification(notification)) {
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

    protected _onSubscriptionChange = (notification: string, observantName: string, subscribe: boolean) => {
        subscribe ? this.subscribe(notification, observantName) : this.unsubscribe(notification, observantName);
    };

    private _hasNotification(key: string): boolean {
        return this._notificationToObservantsMap.has(key);
    }
}
