import { Facade } from "./Facade";
import { Proxy } from "./Proxy";
import { MVCMap } from "./utils";

export class Model {
    private __facade: Facade;
    private __proxiesMap: MVCMap<Proxy<any>>;

    constructor(facade: Facade) {
        this.__facade = facade;
        this.__proxiesMap = new MVCMap();
    }

    public registerProxy(proxy: new () => Proxy<any>): Proxy<any> {
        const proxyInstance = new proxy();
        const name = proxyInstance.constructor.name;
        this.__proxiesMap.set(name, proxyInstance);
        proxyInstance.onRegister(this.__facade);
        return proxyInstance;
    }

    public removeProxy(proxy: new () => Proxy<any>): void {
        if (!this.hasProxy(proxy)) {
            return;
        }

        const key = proxy.name;
        let proxyInstance = this.__proxiesMap.get(key);
        this.__proxiesMap.delete(key);

        proxyInstance.onRemove();
    }

    public hasProxy(proxy: new () => Proxy<any>): boolean {
        const key = proxy.name;
        return this.__proxiesMap.has(key);
    }

    public retrieveProxy(proxy: new () => Proxy<any>): Proxy<any> {
        const key = proxy.name;
        return this.__proxiesMap.get(key);
    }
}
