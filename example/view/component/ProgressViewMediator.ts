/**
 * Created by sargis on 7/5/17.
 */
import { Facade, Mediator } from "../../../src/index";
import GameState from "../../state/GameState";
import ProgressView from "./ProgressView";

export default class ProgressViewMediator extends Mediator<ProgressView> {
    public onRegister(
        facade: Facade,
        onMediatorNotificationSubscriptionChange: (notification: string, mediatorName: string, subscribe: boolean) => void
    ) {
        super.onRegister(facade, onMediatorNotificationSubscriptionChange);
        this._subscribe(GameState.LOAD_START, this._onLoadStart);
        this._subscribe(GameState.FILE_LOAD_COMPLETE, this._onFileLoadComplete);
        this._subscribe(GameState.LOAD_COMPLETE, this._onLoadComplete);

        this.setView(new ProgressView());
        (<any>window).game.world.add(this.view);
    }

    private _onLoadStart(): void {
        this.view.show();
    }
    private _onFileLoadComplete(progress): void {
        this.view.updatePercent(progress);
    }
    private _onLoadComplete(): void {
        this.view.hide();
    }
}
