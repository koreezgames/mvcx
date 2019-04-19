/**
 * Created by sargis on 7/4/17.
 */
import { Facade } from "../src/index";
import { boardCommand, dataCommand, startupCommand, stateReadyCommand } from "./controller/Commands";
import BoardProxy from "./model/BoardProxy";
import GameState from "./state/GameState";
import CellView from "./view/component/CellView";
import CellViewMediator from "./view/component/CellViewMediator";

export default class GameFacade extends Facade {
    public static STARTUP: string = `${GameFacade.name}Startup`;

    public initialize(debug: boolean = false) {
        super.initialize(debug);
        this.sendNotification(GameFacade.STARTUP);
    }

    public initializeController() {
        super.initializeController();
        this.registerCommand(GameFacade.STARTUP, startupCommand);
        this.registerCommand(GameState.STATE_READY, stateReadyCommand);
        this.registerCommand(BoardProxy.DATA_GET, dataCommand);
        this.registerCommand(CellView.CLICK, boardCommand);
        this.registerCommand(BoardProxy.PLAYER_SELECT, boardCommand);
    }

    public initializeView() {
        super.initializeView();
        this.registerDynamicMediator(CellView, CellViewMediator);
    }
}
