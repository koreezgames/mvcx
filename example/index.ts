/**
 * Created by sargis on 7/4/17.
 */
import "pixi";
import "phaser-ce";
import config from "./config";
import GameFacade from "./GameFacade";
import GameState from "./state/GameState";

export default class Game extends Phaser.Game {

    constructor() {
        super(config.gameWidth, config.gameHeight, Phaser.CANVAS, "", null);
        this.state.add(GameState.name, new GameState());
    }

    public init() {
        this.state.start(GameState.name);
    }
}

document.onreadystatechange = () => {
    if (document.readyState === "complete") {
        (<any>window).game = new Game();
        (<any>window).game.init();
        setTimeout(() => {
            GameFacade.Instance.initialize(true);
        }, 0);
    }
};
