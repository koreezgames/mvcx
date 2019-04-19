import BoardProxy from "../model/BoardProxy";
import GameStateMediator from "../state/GameStateMediator";
import CellView from "../view/component/CellView";
import ProgressViewMediator from "../view/component/ProgressViewMediator";

export function startupCommand(notificationName: string) {
    this.registerProxy(BoardProxy);
    this.registerMediator(GameStateMediator);
}

export function stateReadyCommand(notificationName: string) {
    this.sendNotification(BoardProxy.DATA_GET);
    this.removeMediator(ProgressViewMediator);
}

export function dataCommand(notificationName: string) {
    switch (notificationName) {
        case BoardProxy.DATA_GET:
            this.retrieveProxy(BoardProxy).jsonDataGet();
            break;
    }
}

export function boardCommand(notificationName: string, ...args: any[]) {
    switch (notificationName) {
        case CellView.CLICK:
            this.retrieveProxy(BoardProxy).selectCell(args[0]);
            break;
        case BoardProxy.PLAYER_SELECT:
            this.retrieveProxy(BoardProxy).detectPossibleMoves();
            break;
    }
}
