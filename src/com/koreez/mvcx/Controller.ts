import { Facade } from "./Facade";
import { logCommand, logNone, MVCMap } from "./utils";

export class Controller {
    private static readonly _consoleArgs = [
        "",
        `background: ${"#3F234E"}`,
        `background: ${"#6E2994"}`,
        `color: ${"#D4BFE0"}; background: ${"#8724BD"};`,
        `background: ${"#6E2994"}`,
        `background: ${"#3F234E"}`
    ];

    private __commandsMap: MVCMap<ICommand>;
    private __facade: Facade;
    private __logger: (consoleArgs: string[], notificationName: string, commandName: string) => void;

    constructor(facade: Facade) {
        this.__facade = facade;
        this.__logger = this.__facade.debug ? logCommand : logNone;
        this.__commandsMap = new MVCMap();
    }

    public registerCommand(notificationName: string, command: ICommand): void {
        this.__commandsMap.set(notificationName, command);
    }

    public removeCommand(notificationName: string): void {
        this.__commandsMap.delete(notificationName);
    }

    public executeCommand(notificationName: string, command: ICommand, ...args: any[]): void {
        const localCommand = command || this.__commandsMap.get(notificationName);
        if (!localCommand) {
            return;
        }
        this.__logger(Controller._consoleArgs, notificationName, localCommand.name);
        localCommand.call(this.__facade, notificationName, ...args);
    }
}

export type ICommand = (notification: string, ...args: any[]) => void;

export type IGuard = (...args: any[]) => boolean;
