export class BaseState extends Phaser.State {
    public onStart: Phaser.Signal;
    public onReady: Phaser.Signal;
    public onShutdown: Phaser.Signal;

    constructor() {
        super();
        this.onStart = new Phaser.Signal();
        this.onReady = new Phaser.Signal();
        this.onShutdown = new Phaser.Signal();
    }

    public init(...args: any[]) {
        super.init(args);
        this.onStart.dispatch();
    }

    public create(game) {
        super.create(game);
        this.onReady.dispatch();
    }

    public shutdown() {
        this.state.remove(this.constructor.name);
        this.onShutdown.dispatch();
    }
}
