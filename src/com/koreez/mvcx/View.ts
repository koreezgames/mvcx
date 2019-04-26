import { DynamicMediator } from "./DynamicMediator";
import { Facade } from "./Facade";
import { Mediator } from "./Mediator";
import { Observant } from "./Observant";
import { Observer } from "./Observer";
import { MVCMap } from "./utils";

export class View extends Observer {
    private __dynamicMediatorsMap: MVCMap<string, Observant>;

    constructor(facade: Facade) {
        super(facade);
        this.__dynamicMediatorsMap = new MVCMap();
    }

    public registerDynamicMediator<V extends IDynamicView, M extends DynamicMediator<V>>(
        view: new (...args: any[]) => V,
        mediator: new (view: V) => M
    ): void {
        const self = this;
        view.prototype.construct = function() {
            const mediatorInstance: M = new mediator(this);
            self.__dynamicMediatorsMap.set(this.uuid, mediatorInstance);
            mediatorInstance.onRegister(self._facade);
        };

        view.prototype.destruct = function() {
            const mediatorInstance = self.__dynamicMediatorsMap.delete(this.uuid);
            mediatorInstance.onRemove();
        };
    }

    public retrieveDynamicMediator<V extends IDynamicView, M extends DynamicMediator<V>>(view: V): M {
        return this.__dynamicMediatorsMap.get(view.uuid) as M;
    }

    public registerMediator<V, M extends Mediator<V>>(mediator: new (viewComponent?: V) => M): void {
        super.registerObservant(mediator);
    }

    public removeMediator<V, M extends Mediator<V>>(mediator: new (viewComponent?: V) => M): void {
        super.removeObservant(mediator);
    }

    public sleepMediator<V, M extends Mediator<V>>(mediator: new (viewComponent?: V) => M): void {
        super.sleepObservant(mediator);
    }

    public wakeMediator<V, M extends Mediator<V>>(mediator: new (viewComponent?: V) => M): void {
        super.wakeObservant(mediator);
    }

    public retrieveMediator<V, M extends Mediator<V>>(mediator: new (viewComponent?: V) => M): Mediator<V> {
        return super.retrieveObservant(mediator);
    }

    public hasMediator<V, M extends Mediator<V>>(mediator: new (viewComponent?: V) => M): boolean {
        return super.hasObservant(mediator);
    }
    public handleNotification(notification: string, ...args: any[]): void {
        super.handleNotification(notification, ...args);
        this.__dynamicMediatorsMap.values.forEach(value => {
            value.onNotification(notification, ...args);
        });
    }
}

export interface IDynamicView {
    construct: () => void;
    destruct: () => void;
    uuid: string;
}
