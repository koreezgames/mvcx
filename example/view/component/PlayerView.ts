export class PlayerView extends Phaser.Group {
    public static YELLOW = 1;
    public static RED = 2;
    public static BLUE = 3;
    public static GREEN = 4;

    public id: any;
    public color: any;
    public sprite: any;
    public selectedSprite: any;

    constructor(game, id, color) {
        super(game);
        this.id = id;
        this.color = color;
        this.sprite = this.create(0, 0, "tile-" + this.color);
        this.sprite.anchor.setTo(0.5);
        this.selectedSprite = this.create(0, 0, "tile-" + this.color + "-select");
        this.selectedSprite.anchor.setTo(0.5);
        this.remove(this.selectedSprite);
        this.scale.setTo(0.9);
    }

    public select() {
        this.replace(this.sprite, this.selectedSprite);
    }

    public deselect() {
        this.replace(this.selectedSprite, this.sprite);
    }
}
