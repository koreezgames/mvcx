import { IDynamicView } from "../../../src";
import { ObstacleView } from "./ObstacleView";
import { PlayerView } from "./PlayerView";

export default class CellView extends Phaser.Sprite implements IDynamicView {
    public static CLICK = CellView.name + "Click";

    public static CEll_EMPTY = 0;
    public static CEll_PLAYER_1 = 1;
    public static CEll_PLAYER_2 = 2;
    public static CEll_OBSTACLE = 3;

    public construct: () => void;

    public destruct: () => void;

    public get uuid(): string {
        return this._uuid;
    }

    public i: any;
    public j: any;
    public highlightSprite: any;
    public view: any;
    public onClick: any;
    private _uuid: any;

    constructor(game, i, j, cellData) {
        super(game, 32 + i * 64, 32 + j * 64, "tile");
        this._uuid = `${this.constructor.name}${i},${j}`;
        this.i = i;
        this.j = j;
        this.anchor.setTo(0.5);
        this.highlightSprite = this.game.make.sprite(0, 0, "tile-select");
        this.highlightSprite.anchor.setTo(0.5);
        this.onClick = new Phaser.Signal();
        this.inputEnabled = true;
        this.events.onInputUp.add(this.onInputUp, this);
        if (cellData !== CellView.CEll_EMPTY) {
            switch (cellData) {
                case CellView.CEll_PLAYER_1:
                    this.addView(new PlayerView(this.game, CellView.CEll_PLAYER_1, PlayerView.RED));
                    break;
                case CellView.CEll_PLAYER_2:
                    this.addView(new PlayerView(this.game, CellView.CEll_PLAYER_2, PlayerView.GREEN));
                    break;
                case CellView.CEll_OBSTACLE:
                    this.addView(new ObstacleView(this.game));
                    break;
            }
        }
        this.construct();
    }

    public addView(view) {
        if (this.view) {
            this.removeChild(this.view);
        }
        this.addChild(view);
        this.view = view;
    }

    public getView() {
        return this.view;
    }

    public highlight(alpha = 1) {
        this.highlightSprite.alpha = alpha;
        this.addChild(this.highlightSprite);
    }

    public cancelHighlight() {
        this.removeChild(this.highlightSprite);
    }

    public destroy(destroyChildren?: boolean) {
        super.destroy(destroyChildren);
        this.destruct();
    }

    private onInputUp() {
        this.onClick.dispatch();
    }
}
