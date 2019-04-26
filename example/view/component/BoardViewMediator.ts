/**
 * Created by sargis on 7/6/17.
 */
import { Facade, Mediator } from "../../../src/index";
import BoardProxy from "../../model/BoardProxy";
import BoardView from "./BoardView";

export default class BoardViewMediator extends Mediator<BoardView> {
    public static NAME = "ImagesViewMediator";

    public onRegister(facade: Facade) {
        super.onRegister(facade);

        this.setView(new BoardView());
        (<any>window).game.world.add(this.view);

        this._subscribe(BoardProxy.DATA_READY, this._onDataReady);
        this._subscribe(BoardProxy.PLAYER_SELECT, this._onPlayerSelect);
        this._subscribe(BoardProxy.PLAYER_DESELECT, this._onPlayerDeselect);
    }

    private _onDataReady(body: any): void {
        this.view.init(body);
        this.view.show();
    }

    private _onPlayerSelect(body: any): void {
        this.view.selectPlayer(body);
    }

    private _onPlayerDeselect(): void {
        this.view.deselectPlayer();
    }
}
