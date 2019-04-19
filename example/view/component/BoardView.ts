import CellView from "./CellView";
import { PlayerView } from "./PlayerView";

/**
 * Created by sargis on 7/6/17.
 */

export default class BoardView extends Phaser.Group {
    private cells: any[];
    private selectedPlayer: PlayerView;

    constructor() {
        super((<any>window).game);
        this.alpha = 0;
        this.cells = [];
    }

    public init(boardVO) {
        for (let i = 0; i < boardVO.height; ++i) {
            const col = [];
            this.cells.push(col);
            for (let j = 0; j < boardVO.width; ++j) {
                const cellData = boardVO.cells[i][j];
                const cellView = new CellView(this.game, i, j, cellData);
                col.push(cellView);
                this.add(cellView);
            }
        }
    }

    public show() {
        let tween = this.game.add.tween(this);
        tween.to({ alpha: 1 }, 500);
        tween.start();
    }

    public hide() {
        let tween = this.game.add.tween(this);
        tween.to({ alpha: 0 }, 500);
        tween.start();
    }

    public selectPlayer(position) {
        const playerView = this.cells[position.i][position.j].getView();
        if (playerView) {
            playerView.select();
            this.selectedPlayer = playerView;
        }
    }

    public deselectPlayer() {
        if (this.selectedPlayer) {
            this.selectedPlayer.deselect();
            this.selectedPlayer = null;
        }
    }
}
