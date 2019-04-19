export class ObstacleView extends Phaser.Sprite {
    constructor(game) {
        super(game, 0, 0, "tile-block");
        this.anchor.setTo(0.5);
        this.scale.setTo(0.9);
    }
}
