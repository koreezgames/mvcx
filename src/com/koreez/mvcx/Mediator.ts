import { Observant } from "./Observant";

export class Mediator<T> extends Observant {
    public get view(): T {
        return this.__view;
    }

    private __view: T;

    constructor(view?: T) {
        super();
        // tslint:disable-next-line:no-unused-expression
        view && this.setView(view);
    }

    protected setView(value: T) {
        this.__view = value;
    }
}
