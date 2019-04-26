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
    protected _interests: MVCMap<string, INotificationHandler>;
    protected _sleeping: boolean;
    protected _logger: (consoleArgs: string[], name: string, action: string) => void;

    constructor() {
        this._interests = new MVCMap();
    }

    public onRegister(facade: Facade): void {
        this._facade = facade;
        this._logger = this._facade.debug ? logObservant : logNone;
        this._logger(Observant._consoleArgs, this.observantName, "register");
        this.onWake();
    }

    public onRemove(): void {
        this.onSleep();
        this._logger(Observant._consoleArgs, this.observantName, "remove");
    }

    public onSleep(): void {
        this._sleeping = true;
        this._logger(Observant._consoleArgs, this.observantName, "sleep");
    }

    public onWake(): void {
        this._logger(Observant._consoleArgs, this.observantName, "wake");
        this._sleeping = false;
    }

    public onNotification(notification: string, ...args: any[]): void {
        if (this._sleeping) {
            return;
        }
        const callback = this._interests.get(notification);
        // tslint:disable-next-line:no-unused-expression
        callback && callback.call(this, ...args);
    }

    protected _subscribe(notification: string, callback: INotificationHandler): void {
        this._interests.set(notification, callback);
    }

    protected _unsubscribe(notification: string): void {
        this._interests.delete(notification);
    }
}

type INotificationHandler = (...args: any[]) => void;
