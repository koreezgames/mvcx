import { Mediator } from "./Mediator";
import { IDynamicView } from "./View";

export class DynamicMediator<T extends IDynamicView> extends Mediator<T> {
    constructor(view: T) {
        super(view);
    }

    public get observantName(): string {
        return this.view.uuid;
    }
}
