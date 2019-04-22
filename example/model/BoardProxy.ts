/**
 * Created by sargis on 7/4/17.
 */
import { Facade, Proxy } from "../../src/index";
import CellView from "../view/component/CellView";
import BoardVO from "./vo/BoardVO";
export default class BoardProxy extends Proxy<BoardVO> {
    public static DATA_GET = BoardProxy.name + "DataGet";
    public static DATA_READY = BoardProxy.name + "DataReady";
    public static PLAYER_SELECT = BoardProxy.name + "PlayerSelect";
    public static PLAYER_DESELECT = BoardProxy.name + "PlayerDeselect";
    public static POSSIBLE_MOVES_READY = BoardProxy.name + "possibleMovesReady";

    private static DUPLICATE_MOVES = [[-1, 0], [0, -1], [1, 0], [0, 1], [-1, 1], [1, -1], [-1, -1], [1, 1]];

    private static JUMP_MOVES = [[-2, 0], [0, -2], [2, 0], [0, 2]];

    private load: Phaser.Loader;
    private cache: Phaser.Cache;
    private selectedPlayer: any;

    constructor() {
        super();
        this.load = (<any>window).game.load;
        this.cache = (<any>window).game.cache;
    }

    public onRegister(facade: Facade): void {
        super.onRegister(facade);
        this.setVO(new BoardVO());
    }

    public jsonDataGet() {
        this.load.onLoadStart.addOnce(this.onLoadStart, this);
        this.load.onFileComplete.add(this.onFileComplete, this);
        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
        this.load.json("board", "static/assets/json/board.json");
        this.load.start();
    }

    public selectCell(position) {
        if (this.selectedPlayer) {
            this.facade.sendNotification(BoardProxy.PLAYER_DESELECT);
            this.selectedPlayer = null;
        }
        this.checkPlayerSelect(position, this.vo.player1, 1);
        this.checkPlayerSelect(position, this.vo.player2, 2);
    }

    public detectPossibleMoves() {
        if (!this.selectedPlayer) {
            return;
        }
        const duplicateMoves = [];
        const jumpMoves = [];
        this.findMoves(BoardProxy.DUPLICATE_MOVES, duplicateMoves);
        this.findMoves(BoardProxy.JUMP_MOVES, jumpMoves);
        this.facade.sendNotification(BoardProxy.POSSIBLE_MOVES_READY, {
            duplicateMoves,
            jumpMoves
        });
    }

    public findMoves(movePatterns, moves) {
        const playerX = this.selectedPlayer[0];
        const playerY = this.selectedPlayer[1];
        movePatterns.forEach(move => {
            const dX = playerX + move[0];
            const dY = playerY + move[1];
            if (dX >= 0 && dX < this.vo.width && dY >= 0 && dX < this.vo.height) {
                const cell = this.vo.cells[dX][dY];
                if (cell === CellView.CEll_EMPTY) {
                    moves.push({ i: dX, j: dY });
                }
            }
        });
    }

    public checkPlayerSelect(position, player, id) {
        for (const playerPosition of player) {
            if (playerPosition[0] === position.i && playerPosition[1] === position.j) {
                this.selectedPlayer = playerPosition;
                this.facade.sendNotification(BoardProxy.PLAYER_SELECT, position);
                return;
            }
        }
    }

    private onLoadStart() {}

    private onFileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {}

    private onLoadComplete() {
        const board = this.cache.getJSON("board");
        this.vo.width = board.width;
        this.vo.height = board.height;
        this.vo.player1 = board.player1;
        this.vo.player2 = board.player2;
        this.vo.obstacles = board.obstacles;
        this.vo.cells = [];
        this.initCells();
        this.initPlayer(this.vo.player1, CellView.CEll_PLAYER_1);
        this.initPlayer(this.vo.player2, CellView.CEll_PLAYER_2);
        this.initObstacles(this.vo.obstacles);
        this.facade.sendNotification(BoardProxy.DATA_READY, this.vo);
    }

    private initCells() {
        for (let i = 0; i < this.vo.width; ++i) {
            const col = [];
            this.vo.cells.push(col);
            for (let j = 0; j < this.vo.height; ++j) {
                col.push(CellView.CEll_EMPTY);
            }
        }
    }

    private initPlayer(player, id) {
        for (const playerPosition of player) {
            const col = playerPosition[0];
            const row = playerPosition[1];
            this.vo.cells[col][row] = id;
        }
    }

    private initObstacles(obstacles) {
        for (const position of obstacles) {
            const col = position[0];
            const row = position[1];
            this.vo.cells[col][row] = CellView.CEll_OBSTACLE;
        }
    }
}
