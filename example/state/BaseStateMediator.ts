import { Facade, Mediator } from "../../src";
import { BaseState } from "./BaseState";

export class BaseStateMediator<T extends BaseState> extends Mediator<T> {
    public onRegister(
        facade: Facade,
        onMediatorNotificationSubscriptionChange: (notification: string, mediatorName: string, subscribe: boolean) => void
    ) {
        super.onRegister(facade, onMediatorNotificationSubscriptionChange);
        this.viewComponent.onStart.add(this.onStateStart, this);
        this.viewComponent.onReady.add(this.onStateReady, this);
        this.viewComponent.onShutdown.add(this.onStateShutdown, this);
    }

    public onRemove() {
        this.viewComponent.shutdown();
        this.onRemove();
    }

    protected onStateStart(): void {
        // @ts-ignore
        this.facade.sendNotification(this.viewComponent.constructor.STATE_START);
    }

    protected onStateReady(): void {
        // @ts-ignore
        this.facade.sendNotification(this.viewComponent.constructor.STATE_READY);
    }

    protected onStateShutdown(): void {
        // @ts-ignore
        this.facade.sendNotification(this.viewComponent.constructor.STATE_SHUTDOWN);
    }
}
