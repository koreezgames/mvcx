import { Controller, ICommand } from "./Controller";
import { DynamicMediator } from "./DynamicMediator";
import { Mediator } from "./Mediator";
import { Model } from "./Model";
import { Proxy } from "./Proxy";
import { logNone, logNotification } from "./utils";
import { IDynamicView, View } from "./View";

export class Facade {
    private static readonly _consoleArgs: string[] = [
        "",
        `background: ${"#757130"}`,
        `background: ${"#DED434"}`,
        `color: ${"#2F2E15"}; background: ${"#FFF325"};`,
        `background: ${"#DED434"}`,
        `background: ${"#757130"}`
    ];
    private static __instance: Facade;
    private __controller: Controller;
    private __model: Model;
    private __view: View;
    private __debug: boolean;
    private __logger: (consoleArgs: string[], notificationName: string) => void;

    public static get Instance() {
        return this.__instance || (this.__instance = new this());
    }

    public sendNotification(notification: string, ...args: any[]) {
        this.__logger(Facade._consoleArgs, notification);
        this.__controller.executeCommand(notification, undefined, ...args);
        this.__view.handleNotification(notification, ...args);
    }

    public registerDynamicMediator(view: new (...args: any[]) => IDynamicView, mediator: new () => DynamicMediator<IDynamicView>): void {
        return this.__view.registerDynamicMediator(view, mediator);
    }
    public registerMediator(mediator: new () => Mediator<any>): Mediator<any> {
        return this.__view.registerMediator(mediator);
    }
    public removeMediator(mediator: new () => Mediator<any>): void {
        return this.__view.removeMediator(mediator);
    }
    public sleepMediator(mediator: new () => Mediator<any>): void {
        return this.__view.sleepMediator(mediator);
    }
    public wakeMediator(mediator: new () => Mediator<any>): void {
        return this.__view.wakeMediator(mediator);
    }
    public retrieveMediator(mediator: new () => Mediator<any>): Mediator<any> {
        return this.__view.retrieveMediator(mediator);
    }
    public hasMediator(mediator: new () => Mediator<any>): boolean {
        return this.__view.hasMediator(mediator);
    }
    //
    public registerProxy(proxy: new () => Proxy<any>): Proxy<any> {
        return this.__model.registerProxy(proxy);
    }
    public removeProxy(proxy: new () => Proxy<any>): void {
        return this.__model.removeProxy(proxy);
    }
    public retrieveProxy(proxy: new () => Proxy<any>): Proxy<any> {
        return this.__model.retrieveProxy(proxy);
    }
    public hasProxy(proxy: new () => Proxy<any>): boolean {
        return this.__model.hasProxy(proxy);
    }
    //
    public registerCommand(notificationName: string, command: ICommand): void {
        return this.__controller.registerCommand(notificationName, command);
    }
    public removeCommand(notificationName: string): void {
        return this.__controller.removeCommand(notificationName);
    }

    public executeCommand(notificationName: string, command: ICommand, ...args: any[]): void {
        return this.__controller.executeCommand(notificationName, command, args);
    }
    //
    public initialize(debug: boolean) {
        this.__debug = debug;
        this.__logger = this.__debug ? logNotification : logNone;
        this.initializeController();
        this.initializeModel();
        this.initializeView();
    }
    protected initializeModel() {
        this.__model = new Model(this);
    }
    protected initializeController() {
        this.__controller = new Controller(this);
    }
    protected initializeView() {
        this.__view = new View(this);
    }

    public get debug(): boolean {
        return this.__debug;
    }
}
