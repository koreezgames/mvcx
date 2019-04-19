/**
 * Created by sargis on 7/6/17.
 */
import { Facade, Mediator } from "../../../src/index";
import BoardProxy from "../../model/BoardProxy";
import BoardView from "./BoardView";

export default class BoardViewMediator extends Mediator<BoardView> {
    public static NAME = "ImagesViewMediator";

    public onRegister(
        facade: Facade,
        onMediatorNotificationSubscriptionChange: (notification: string, mediatorName: string, subscribe: boolean) => void
    ) {
        super.onRegister(facade, onMediatorNotificationSubscriptionChange);

        this.setViewComponent(new BoardView());
        (<any>window).game.world.add(this.viewComponent);

        this._subscribe(BoardProxy.DATA_READY, this._onDataReady);
        this._subscribe(BoardProxy.PLAYER_SELECT, this._onPlayerSelect);
        this._subscribe(BoardProxy.PLAYER_DESELECT, this._onPlayerDeselect);
    }

    private _onDataReady(body: any): void {
        this.viewComponent.init(body);
        this.viewComponent.show();
    }

    private _onPlayerSelect(body: any): void {
        this.viewComponent.selectPlayer(body);
    }

    private _onPlayerDeselect(): void {
        this.viewComponent.deselectPlayer();
    }
}
