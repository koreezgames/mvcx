import { DynamicMediator } from "./DynamicMediator";
import { Facade } from "./Facade";
import { Mediator } from "./Mediator";
import { Observer } from "./Observer";

export class View extends Observer {
    constructor(facade: Facade) {
        super(facade);
    }

    public registerDynamicMediator<V extends IDynamicView, M extends DynamicMediator<V>>(
        view: new (...args: any[]) => V,
        mediator: new (view: V) => M
    ): void {
        const self = this;
        view.prototype.construct = function() {
            const mediatorInstance: M = new mediator(this);
            self._observantsMap.set(this.uuid, mediatorInstance);
            mediatorInstance.onRegister(self._facade, self._onSubscriptionChange);
        };

        view.prototype.destruct = function() {
            const mediatorInstance = self._observantsMap.delete(this.uuid);
            mediatorInstance.onRemove();
        };
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
}

export interface IDynamicView {
    construct: () => void;
    destruct: () => void;
    uuid: string;
}
