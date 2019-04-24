import { Facade } from "./Facade";
import { logNone, logObservant, MVCMap } from "./utils";

export class Observant {
    public get observantName(): string {
        return this.constructor.name;
    }

    protected get facade(): Facade {
        return this._facade;
    }

    protected static readonly _consoleArgs: string[] = [
        "",
        `background: ${"#2A3351"}`,
        `background: ${"#364D98"}`,
        `color: ${"#F4F6FE"}; background: ${"#3656C1"};`,
        `background: ${"#364D98"}`,
        `background: ${"#2A3351"}`
    ];

    protected _facade: Facade;
    protected _interests: MVCMap<any>;
    protected _logger: (consoleArgs: string[], name: string, action: string) => void;

    protected _onSubscriptionChange: (notification: string, mediatorName: string, subscribe: boolean) => void;

    constructor() {
        this._interests = new MVCMap();
    }

    public onRegister(
        facade: Facade,
        onSubscriptionChange: (notification: string, mediatorName: string, subscribe: boolean) => void
    ): void {
        this._facade = facade;
        this._logger = this._facade.debug ? logObservant : logNone;
        this._onSubscriptionChange = onSubscriptionChange;
        this._logger(Observant._consoleArgs, this.observantName, "register");
    }

    public onRemove(): void {
        this._onSubscriptionChange = null;
        this._logger(Observant._consoleArgs, this.observantName, "remove");
    }

    public onNotification(notification: string, ...args: any[]): void {
        const callback = this._interests.get(notification);
        callback.call(this, ...args);
    }

    protected _subscribe(notification: string, callback: any): void {
        this._interests.set(notification, callback);
        this._onSubscriptionChange(notification, this.observantName, true);
    }

    protected _unsubscribe(notification: string): void {
        this._interests.delete(notification);
        this._onSubscriptionChange(notification, this.observantName, false);
    }
}
