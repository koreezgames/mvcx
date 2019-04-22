import { Mediator } from "./Mediator";
import { IDynamicView } from "./View";

export class DynamicMediator<T extends IDynamicView> extends Mediator<T> {
    protected get mediatorName(): string {
        return this.view.uuid;
    }
}
