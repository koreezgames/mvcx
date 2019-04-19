import { BaseState } from "./BaseState";

/**
 * Created by sargis on 7/6/17.
 */

export default class GameState extends BaseState {
    public static STATE_START: string = `${GameState.name}Start`;
    public static STATE_READY: string = `${GameState.name}Ready`;
    public static STATE_SHUTDOWN: string = `${GameState.name}Shutdown`;
    public static LOAD_START: string = `${GameState.name}LoadStart`;
    public static FILE_LOAD_COMPLETE: string = `${GameState.name}FileLoadComplete`;
    public static LOAD_COMPLETE: string = `${GameState.name}LoadComplete`;

    public onLoadStart: Phaser.Signal;
    public onFileLoadComplete: Phaser.Signal;
    public onLoadComplete: Phaser.Signal;

    constructor() {
        super();

        this.onLoadStart = new Phaser.Signal();
        this.onFileLoadComplete = new Phaser.Signal();
        this.onLoadComplete = new Phaser.Signal();
    }

    public init(...args: any[]) {
        this.game.renderer.renderSession.roundPixels = true;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    }

    public preload() {
        this.load.onLoadStart.addOnce(this._onLoadStart, this);
        this.load.onFileComplete.add(this._onFileLoadComplete, this);
        this.load.onLoadComplete.addOnce(this._onLoadComplete, this);
        this.load.pack("initial", "static/assets/assets.json");
        this.load.start();
    }

    private _onLoadStart() {
        this.onLoadStart.dispatch();
    }

    private _onFileLoadComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
        this.onFileLoadComplete.dispatch(progress);
    }

    private _onLoadComplete() {
        this.onLoadComplete.dispatch();
    }
}
