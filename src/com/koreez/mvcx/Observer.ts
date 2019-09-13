import { Facade } from "./Facade";
import { Observant } from "./Observant";
import { MVCMap } from "./utils";

export class Observer {
    protected _facade: Facade;
    protected _observantsMap: MVCMap<new () => Observant, Observant>;
    protected _sleptObservantsMap: MVCMap<new () => Observant, Observant>;

    constructor(facade: Facade) {
        this._facade = facade;
        this._observantsMap = new MVCMap();
        this._sleptObservantsMap = new MVCMap();
    }

    public registerObservant<O extends Observant>(observant: new () => O): void {
        if (this.hasObservant(observant) || this.hasSleptObservant(observant)) {
            return;
        }
        const observantInstance = new observant();
        this._observantsMap.set(observant, observantInstance);
        observantInstance.onRegister(this._facade);
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
        return this._observantsMap.get(observant) as O;
    }

    public hasObservant<O extends Observant>(observant: new () => O): boolean {
        return this._observantsMap.has(observant);
    }

    public hasSleptObservant<O extends Observant>(observant: new () => O): boolean {
        return this._sleptObservantsMap.has(observant);
    }

    public sleepObservant<O extends Observant>(observant: new () => O): void {
        if (!this.hasObservant(observant)) {
            return;
        }

        let observantInstance = this._observantsMap.get(observant);
        this._sleptObservantsMap.set(observant, observantInstance);
        this._observantsMap.delete(observant);
        observantInstance.onSleep();
    }

    public wakeObservant<O extends Observant>(observant: new () => O): void {
        if (!this.hasSleptObservant(observant)) {
            return;
        }

        let observantInstance = this._sleptObservantsMap.get(observant);
        this._observantsMap.set(observant, observantInstance);
        this._sleptObservantsMap.delete(observant);
        observantInstance.onWake();
    }

    public handleNotification(notification: string, ...args: any[]): void {
        this._observantsMap.forEach((key, value) => {
            value.onNotification(notification, ...args);
        });
    }

    private static __removeObservant<O extends Observant>(map: MVCMap<new () => Observant, Observant>, observant: new () => O): void {
        let observantInstance = map.get(observant);
        map.delete(observant);
        observantInstance.onRemove();
    }
}
