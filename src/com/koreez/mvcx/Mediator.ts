import { Facade } from "./Facade";
import { Observant } from "./Observant";

export class Mediator<T> extends Observant {
    public get view(): T {
        return this.__view;
    }

    protected get facade(): Facade {
        return this._facade;
    }

    private __view: T;

    constructor(view?: T) {
        super();
        // tslint:disable-next-line:no-unused-expression
        view && this.setView(view);
    }

    public onRegister(
        facade: Facade,
        onSubscriptionChange: (notification: string, mediatorName: string, subscribe: boolean) => void
    ): void {
        super.onRegister(facade, onSubscriptionChange);
        this.onWake();
    }

    public onRemove(): void {
        this.onSleep();
        super.onRemove();
    }

    public onSleep(): void {
        this._interests.forEach((notification: string) => this._unsubscribe(notification));
        this._logger(Observant._consoleArgs, this.observantName, "sleep");
    }

    public onWake(): void {
        this._interests.forEach((notification: string, callback: any) => this._subscribe(notification, callback));
        this._logger(Observant._consoleArgs, this.observantName, "wake");
    }

    protected setView(value: T) {
        this.__view = value;
    }
}
