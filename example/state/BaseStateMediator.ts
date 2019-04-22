import { Facade, Mediator } from "../../src";
import { BaseState } from "./BaseState";

export class BaseStateMediator<T extends BaseState> extends Mediator<T> {
    public onRegister(
        facade: Facade,
        onMediatorNotificationSubscriptionChange: (notification: string, mediatorName: string, subscribe: boolean) => void
    ) {
        super.onRegister(facade, onMediatorNotificationSubscriptionChange);
        this.view.onStart.add(this.onStateStart, this);
        this.view.onReady.add(this.onStateReady, this);
        this.view.onShutdown.add(this.onStateShutdown, this);
    }

    public onRemove() {
        this.view.shutdown();
        this.onRemove();
    }

    protected onStateStart(): void {
        // @ts-ignore
        this.facade.sendNotification(this.view.constructor.STATE_START);
    }

    protected onStateReady(): void {
        // @ts-ignore
        this.facade.sendNotification(this.view.constructor.STATE_READY);
    }

    protected onStateShutdown(): void {
        // @ts-ignore
        this.facade.sendNotification(this.view.constructor.STATE_SHUTDOWN);
    }
}
