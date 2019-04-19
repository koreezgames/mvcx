// ------------------------------------------------------------------------------
//  Copyright (c) 2018 Koreez LLC. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { assert } from "chai";
import { DynamicMediator, Facade, IDynamicView, Mediator, Proxy } from "../../../../src";
import "../../../entry";

describe("mvcx", () => {
    it("Faced", done => {
        const config = {
            create
        };

        function create() {
            const facade = Facade.Instance;
            facade.initialize(false);
            assert.instanceOf(facade, Facade);
            done();
        }
        (window as any).game = new Phaser.Game(800, 600, Phaser.CANVAS, null, config);
    });

    it("Command", done => {
        const config = {
            create
        };

        function create() {
            const facade = Facade.Instance;
            facade.initialize(false);
            facade.registerCommand("notification", function(name: string) {
                assert.equal("notification", name);
                assert.instanceOf(this, Facade);
                done();
            });
            facade.sendNotification("notification");
        }

        (window as any).game = new Phaser.Game(800, 600, Phaser.CANVAS, null, config);
    });

    it("Proxy", done => {
        class TestData {}

        class TestProxy extends Proxy<TestData> {
            constructor() {
                super();
                this.vo = new TestData();
            }
        }

        const config = {
            create
        };

        function create() {
            const facade = Facade.Instance;
            facade.registerProxy(TestProxy);
            facade.registerCommand("notification", () => {
                const testProxy = facade.retrieveProxy(TestProxy);
                assert.instanceOf(testProxy, TestProxy);
                assert.instanceOf(testProxy.vo, TestData);
                done();
            });
            facade.sendNotification("notification");
        }

        (window as any).game = new Phaser.Game(800, 600, Phaser.CANVAS, null, config);
    });

    it("Mediator", done => {
        class TestMediator extends Mediator<Phaser.World> {
            public handledNotifications: number = 0;

            public onRegister(
                facade: Facade,
                onMediatorNotificationSubscriptionChange: (notification: string, mediatorName: string, subscribe: boolean) => void
            ) {
                super.onRegister(facade, onMediatorNotificationSubscriptionChange);
                this.setViewComponent((window as any).game.world);
                this.addHandler();
            }

            public onNotification(): void {
                assert.instanceOf(this.viewComponent, Phaser.World);
                ++this.handledNotifications;
            }

            public removeHandler(): void {
                this._unsubscribe("notification");
            }

            public addHandler(): void {
                this._subscribe("notification", this.onNotification);
            }
        }

        const config = {
            create
        };

        function create() {
            const facade = Facade.Instance;
            facade.initialize(false);
            facade.registerMediator(TestMediator);
            const testMediator = facade.retrieveMediator(TestMediator) as TestMediator;
            let handledNotifications = 0;
            facade.sendNotification("notification");
            ++handledNotifications;
            testMediator.removeHandler();
            facade.sendNotification("notification");
            facade.sendNotification("notification");
            facade.sendNotification("notification");
            testMediator.addHandler();
            setTimeout(() => {
                facade.sendNotification("notification");
                ++handledNotifications;
                facade.sendNotification("notification");
                ++handledNotifications;
                facade.sendNotification("notification");
                ++handledNotifications;
                testMediator.removeHandler();
                setTimeout(() => {
                    facade.sendNotification("notification");
                    facade.sendNotification("notification");
                    facade.sendNotification("notification");
                    testMediator.addHandler();
                    setTimeout(() => {
                        facade.sendNotification("notification");
                        ++handledNotifications;
                        facade.sendNotification("notification");
                        ++handledNotifications;
                        assert.equal(handledNotifications, testMediator.handledNotifications);
                        done();
                    }, 200);
                }, 200);
            }, 200);
        }

        (window as any).game = new Phaser.Game(800, 600, Phaser.CANVAS, null, config);
    });

    it("DynamicMediator", done => {
        class TestView implements IDynamicView {
            public construct: () => void;

            public destruct: () => void;

            public get uuid(): string {
                return this._uuid;
            }

            private _uuid;

            constructor() {
                this._uuid = `TestMediator`;
                this.construct();
            }
        }

        class TestMediator extends DynamicMediator<TestView> {
            public handledNotifications: number = 0;

            public onRegister(
                facade: Facade,
                onMediatorNotificationSubscriptionChange: (notification: string, mediatorName: string, subscribe: boolean) => void
            ) {
                super.onRegister(facade, onMediatorNotificationSubscriptionChange);
                this.addHandler();
            }

            public onNotification(): void {
                assert.instanceOf(this.viewComponent, TestView);
                ++this.handledNotifications;
            }

            public removeHandler(): void {
                this._unsubscribe("notification");
            }

            public addHandler(): void {
                this._subscribe("notification", this.onNotification);
            }
        }

        const config = {
            create
        };

        function create() {
            const facade = Facade.Instance;
            facade.initialize(false);
            facade.registerDynamicMediator(TestView, TestMediator);
            const testView = new TestView();
            const testMediator = facade.retrieveMediator(TestMediator) as TestMediator;
            let handledNotifications = 0;
            facade.sendNotification("notification");
            ++handledNotifications;
            testMediator.removeHandler();
            facade.sendNotification("notification");
            facade.sendNotification("notification");
            facade.sendNotification("notification");
            testMediator.addHandler();
            setTimeout(() => {
                facade.sendNotification("notification");
                ++handledNotifications;
                facade.sendNotification("notification");
                ++handledNotifications;
                facade.sendNotification("notification");
                ++handledNotifications;
                testMediator.removeHandler();
                setTimeout(() => {
                    facade.sendNotification("notification");
                    facade.sendNotification("notification");
                    facade.sendNotification("notification");
                    testMediator.addHandler();
                    setTimeout(() => {
                        facade.sendNotification("notification");
                        ++handledNotifications;
                        facade.sendNotification("notification");
                        ++handledNotifications;
                        testView.destruct();
                        facade.sendNotification("notification");
                        facade.sendNotification("notification");
                        facade.sendNotification("notification");
                        assert.equal(handledNotifications, testMediator.handledNotifications);
                        done();
                    }, 200);
                }, 200);
            }, 200);
        }

        (window as any).game = new Phaser.Game(800, 600, Phaser.CANVAS, null, config);
    });
});
