import { Facade } from "./Facade";
import { logNone, logProxy } from "./utils";

export class Proxy<T> {
    private static readonly _consoleArgs: string[] = [
        "",
        `background: ${"#295A34"}`,
        `background: ${"#2FAA4A"}`,
        `color: ${"#102415"}; background: ${"#27D04C"};`,
        `background: ${"#2FAA4A"}`,
        `background: ${"#295A34"}`
    ];

    private __facade: Facade;
    private __vo: T;
    private __logger: (consoleArgs: string[], name: string, action: string) => void;

    constructor(vo?: T) {
        this.setVO(vo);
    }

    public onRegister(facade: Facade): void {
        this.__facade = facade;
        this.__logger = this.__facade.debug ? logProxy : logNone;
        this.__logger(Proxy._consoleArgs, this.constructor.name, "register");
    }

    public onRemove(): void {
        this.__logger(Proxy._consoleArgs, this.constructor.name, "remove");
    }

    public get vo(): T {
        return this.__vo;
    }

    protected setVO(value: T) {
        this.__vo = value;
    }

    protected get facade(): Facade {
        return this.__facade;
    }
}
