import { Controller, ICommand, IGuard } from "./Controller";
import { DynamicMediator } from "./DynamicMediator";
import { Mediator } from "./Mediator";
import { Model } from "./Model";
import { Observant } from "./Observant";
import { Observer } from "./Observer";
import { Proxy } from "./Proxy";
import { logNone, logNotification, notValidNotification } from "./utils";
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
    private __observer: Observer;
    private __debug: boolean;
    private __logger: (consoleArgs: string[], notificationName: string) => void;

    public static get Instance() {
        return this.__instance || (this.__instance = new this());
    }

    public sendNotification(notification: string, ...args: any[]) {
        if (notValidNotification(notification)) {
            throw new Error(`Can't send notification  "${notification}"`);
        }
        this.__logger(Facade._consoleArgs, notification);
        this.__controller.executeCommand(notification, undefined, ...args);
        this.__observer.handleNotification(notification, ...args);
        this.__view.handleNotification(notification, ...args);
    }

    public registerDynamicMediator<V extends IDynamicView, M extends DynamicMediator<V>>(
        view: new (...args: any[]) => V,
        mediator: new (view: V) => M
    ): void {
        return this.__view.registerDynamicMediator(view, mediator);
    }

    public registerMediator<V, M extends Mediator<V>>(mediator: new (viewComponent?: V) => M): void {
        this.__view.registerMediator(mediator);
    }

    public removeMediator<V, M extends Mediator<V>>(mediator: new (viewComponent?: V) => M): void {
        this.__view.removeMediator(mediator);
    }

    public sleepMediator<V, M extends Mediator<V>>(mediator: new (viewComponent?: V) => M): void {
        this.__view.sleepMediator(mediator);
    }

    public wakeMediator<V, M extends Mediator<V>>(mediator: new (viewComponent?: V) => M): void {
        this.__view.wakeMediator(mediator);
    }

    public retrieveMediator<V, M extends Mediator<V>>(mediator: new (viewComponent?: V) => M): M {
        return this.__view.retrieveMediator(mediator) as M;
    }

    public retrieveDynamicMediator<V extends IDynamicView, M extends DynamicMediator<V>>(view: V | string): M {
        return this.__view.retrieveDynamicMediator(view);
    }

    public hasMediator<V, M extends Mediator<V>>(mediator: new (viewComponent?: V) => M): boolean {
        return this.__view.hasMediator(mediator);
    }
    //
    public registerProxy<D, P extends Proxy<D>>(proxy: new () => P): P {
        return this.__model.registerProxy(proxy);
    }

    public removeProxy<D, P extends Proxy<D>>(proxy: new () => P): void {
        this.__model.removeProxy(proxy);
    }

    public retrieveProxy<D, P extends Proxy<D>>(proxy: new () => P): P {
        return this.__model.retrieveProxy(proxy);
    }

    public hasProxy<D, P extends Proxy<D>>(proxy: new () => P): boolean {
        return this.__model.hasProxy(proxy);
    }
    //
    public registerCommand(notificationName: string, command: ICommand): void {
        if (notValidNotification(notificationName)) {
            throw new Error(`Can't register command on notification  "${notificationName}"`);
        }
        this.__controller.registerCommand(notificationName, command);
    }

    public removeCommand(notificationName: string): void {
        if (notValidNotification(notificationName)) {
            throw new Error(`Can't remove command from notification  "${notificationName}"`);
        }
        this.__controller.removeCommand(notificationName);
    }

    public executeCommand(notificationName: string, command: ICommand, ...args: any[]): void {
        if (notValidNotification(notificationName)) {
            throw new Error(`Can't execute command on notification  "${notificationName}"`);
        }
        this.__controller.executeCommand(notificationName, command, ...args);
    }
    //
    public registerObservant<O extends Observant>(observant: new () => O): void {
        this.__observer.registerObservant(observant);
    }

    public removeObservant<O extends Observant>(observant: new () => O): void {
        this.__observer.removeObservant(observant);
    }

    public sleepObservant<O extends Observant>(observant: new () => O): void {
        this.__observer.sleepObservant(observant);
    }

    public wakeObservant<O extends Observant>(observant: new () => O): void {
        this.__observer.wakeObservant(observant);
    }

    public retrieveObservant<O extends Observant>(mediator: new () => O): O {
        return this.__observer.retrieveObservant(mediator);
    }

    public hasObservant<O extends Observant>(mediator: new () => O): boolean {
        return this.__observer.hasObservant(mediator);
    }

    public executeCommandWithGuard(guard: IGuard | IGuard[], notificationName: string, command: ICommand, ...args: any[]): void {
        const guards = Array.isArray(guard) ? guard : [guard];
        const passed = guards.reduce((previousValue: boolean, currentGuard: IGuard) => {
            return previousValue && currentGuard.call(this, ...args);
        }, true);
        if (passed) {
            this.executeCommand(notificationName, command, ...args);
        }
    }
    //
    public initialize(debug: boolean) {
        this.__debug = debug;
        this.__logger = this.__debug ? logNotification : logNone;
        this.initializeController();
        this.initializeModel();
        this.initializeObserver();
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

    protected initializeObserver() {
        this.__observer = new Observer(this);
    }

    public get debug(): boolean {
        return this.__debug;
    }
}
