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

    public registerCommand(key: string, command: ICommand): void {
        this.__commandsMap.set(key, command);
    }

    public removeCommand(key: string): void {
        this.__commandsMap.delete(key);
    }

    public executeCommand(key: string, ...args: any[]): void {
        const command = this.__commandsMap.get(key);
        if (!command) {
            return;
        }
        this.__logger(Controller._consoleArgs, key, command.name);
        command.call(this.__facade, key, ...args);
    }
}

export type ICommand = (notification: string, ...args: any[]) => void;
