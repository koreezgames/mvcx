/**
 * Created by sargis on 7/6/17.
 */
import { DynamicMediator, Facade } from "../../../src/index";
import BoardProxy from "../../model/BoardProxy";
import CellView from "./CellView";

export default class CellViewMediator extends DynamicMediator<CellView> {
    public static NAME = "ImagesViewMediator";

    public onRegister(
        facade: Facade,
        onMediatorNotificationSubscriptionChange: (notification: string, mediatorName: string, subscribe: boolean) => void
    ) {
        super.onRegister(facade, onMediatorNotificationSubscriptionChange);
        this.viewComponent.onClick.add(this.onViewClick, this);

        // this._subscribe(BoardProxy.DATA_READY, this._onDataReady);
        // this._subscribe(BoardProxy.PLAYER_SELECT, this._onPlayerSelect);
        this._subscribe(BoardProxy.PLAYER_DESELECT, this._onPlayerDeselect);
        this._subscribe(BoardProxy.POSSIBLE_MOVES_READY, this._onPossibleMovesReady);
    }

    // private _onDataReady(body: any): void {
    //     this.viewComponent.init(body);
    //     this.viewComponent.show();
    // }
    // private _onPlayerSelect(body: any): void {
    //     this.viewComponent.selectPlayer(body);
    // }
    private _onPlayerDeselect(): void {
        // this.viewComponent.deselectPlayer();
        this.viewComponent.cancelHighlight();
    }

    private _onPossibleMovesReady(body: any): void {
        const isDuplicateMoves = (body.duplicateMoves as [{}]).some(
            (pos: any) => pos.i === this.viewComponent.i && pos.j === this.viewComponent.j
        );
        const isJumpMoves = (body.jumpMoves as [{}]).some((pos: any) => pos.i === this.viewComponent.i && pos.j === this.viewComponent.j);
        switch (true) {
            case isDuplicateMoves:
                this.viewComponent.highlight(1);
                break;
            case isJumpMoves:
                this.viewComponent.highlight(0.5);
                break;
        }
    }

    private onViewClick() {
        this.facade.sendNotification(CellView.CLICK, { i: this.viewComponent.i, j: this.viewComponent.j });
    }
}
