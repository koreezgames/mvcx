/**
 * Created by sargis on 7/4/17.
 */
import { Facade, Mediator } from "../../src/index";
import BoardViewMediator from "../view/component/BoardViewMediator";
import ProgressViewMediator from "../view/component/ProgressViewMediator";
import GameState from "./GameState";

export default class GameStateMediator extends Mediator<GameState> {
    constructor() {
        super();

        // @ts-ignore
        this.setView(window.game.state.states[GameState.name] as GameState);
        this.view.onLoadStart.add(this._onLoadStart, this);
        this.view.onFileLoadComplete.add(this._onFileLoadComplete, this);
        this.view.onLoadComplete.add(this._onLoadComplete, this);
        this.view.onReady.add(this._onStateReady, this);
    }

    public onRegister(
        facade: Facade,
        onMediatorNotificationSubscriptionChange: (notification: string, mediatorName: string, subscribe: boolean) => void
    ) {
        super.onRegister(facade, onMediatorNotificationSubscriptionChange);
        this.facade.registerMediator(ProgressViewMediator);
        this.facade.registerMediator(BoardViewMediator);
    }

    public _onStateReady() {
        this.facade.sendNotification(GameState.STATE_READY);
    }

    private _onLoadStart() {
        this.facade.sendNotification(GameState.LOAD_START);
    }

    private _onFileLoadComplete(progress) {
        this.facade.sendNotification(GameState.FILE_LOAD_COMPLETE, progress);
    }

    private _onLoadComplete() {
        this.facade.sendNotification(GameState.LOAD_COMPLETE);
    }
}
