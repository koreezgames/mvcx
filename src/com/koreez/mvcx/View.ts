import { DynamicMediator } from "./DynamicMediator";
import { Facade } from "./Facade";
import { Mediator } from "./Mediator";
import { MVCMap } from "./utils";

export class View {
    private __facade: Facade;
    private __mediatorsMap: MVCMap<Mediator<any>>;
    private __eventsMap: MVCMap<string[]>;

    constructor(facade: Facade) {
        this.__facade = facade;
        this.__mediatorsMap = new MVCMap();
        this.__eventsMap = new MVCMap();
    }

    public registerDynamicMediator(view: new (...args: any[]) => IDynamicView, mediator: new () => DynamicMediator<IDynamicView>): void {
        const self = this;
        view.prototype.construct = function() {
            const mediatorInstance: Mediator<any> = new mediator();
            self.__mediatorsMap.set(this.uuid, mediatorInstance);

            // @ts-ignore
            mediatorInstance.setViewComponent(this);
            mediatorInstance.onRegister(self.__facade, self.__onMediatorNotificationSubscriptionChange);
        };

        view.prototype.destruct = function() {
            const mediatorInstance = self.__mediatorsMap.delete(this.uuid);
            mediatorInstance.onRemove();
        };
    }

    public registerMediator(mediator: new () => Mediator<any>): Mediator<any> {
        const mediatorInstance = new mediator();
        const name = mediatorInstance.constructor.name;
        this.__mediatorsMap.set(name, mediatorInstance);
        mediatorInstance.onRegister(this.__facade, this.__onMediatorNotificationSubscriptionChange);
        return mediatorInstance;
    }

    public removeMediator(mediator: new () => Mediator<any>): void {
        if (!this.hasMediator(mediator)) {
            return;
        }

        const key = mediator.name;
        let mediatorInstance = this.__mediatorsMap.get(key);

        this.__mediatorsMap.delete(key);
        mediatorInstance.onRemove();
    }

    public sleepMediator(mediator: new () => Mediator<any>): void {
        if (!this.hasMediator(mediator)) {
            return;
        }

        const key = mediator.name;
        let mediatorInstance = this.__mediatorsMap.get(key);
        mediatorInstance.onSleep();
    }

    public wakeMediator(mediator: new () => Mediator<any>): void {
        if (!this.hasMediator(mediator)) {
            return;
        }

        const key = mediator.name;
        let mediatorInstance = this.__mediatorsMap.get(key);
        mediatorInstance.onWake();
    }

    public retrieveMediator(mediator: new () => Mediator<any>): Mediator<any> {
        return this.__mediatorsMap.get(mediator.name);
    }

    public hasMediator(mediator: new () => Mediator<any>): boolean {
        return this.__mediatorsMap.has(mediator.name);
    }

    public handleNotification(notification: string, ...args: any[]): void {
        if (this.__hasEvent(notification)) {
            const names = this.__eventsMap.get(notification);
            names.forEach((name: string) => {
                const mediator = this.__mediatorsMap.get(name);
                mediator.onNotification(notification, ...args);
            });
        }
    }

    public subscribe(notification: string, mediatorName: string): void {
        if (!this.__hasEvent(notification)) {
            this.__eventsMap.set(notification, [mediatorName]);
        } else {
            const names = this.__eventsMap.get(notification);
            const existing = names.indexOf(mediatorName);
            if (existing !== -1) {
                names[existing] = mediatorName;
            } else {
                names.push(mediatorName);
            }
        }
    }

    public unsubscribe(notification: string, mediatorName: string): void {
        if (!this.__hasEvent(notification)) {
            return;
        }

        const names = this.__eventsMap.get(notification);
        const existing = names.indexOf(mediatorName);
        if (existing !== -1) {
            names.splice(existing, 1);
            if (!names.length) {
                this.__eventsMap.delete(notification);
            }
        }
    }

    private __onMediatorNotificationSubscriptionChange = (notification: string, mediatorName: string, subscribe: boolean) => {
        subscribe ? this.subscribe(notification, mediatorName) : this.unsubscribe(notification, mediatorName);
    };

    private __hasEvent(key: string): boolean {
        return this.__eventsMap.has(key);
    }
}

export interface IDynamicView {
    construct: () => void;
    destruct: () => void;
    uuid: string;
}
