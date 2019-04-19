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

    public registerProxy<T>(proxy: new () => Proxy<T>): Proxy<T> {
        const proxyInstance = new proxy();
        const name = proxyInstance.constructor.name;
        this.__proxiesMap.set(name, proxyInstance);
        proxyInstance.onRegister(this.__facade);
        return proxyInstance;
    }

    public removeProxy<T>(proxy: new () => Proxy<T>): void {
        if (!this.hasProxy(proxy)) {
            return;
        }

        const key = proxy.name;
        let proxyInstance = this.__proxiesMap.get(key);
        this.__proxiesMap.delete(key);

        proxyInstance.onRemove();
    }

    public hasProxy<T>(proxy: new () => Proxy<T>): boolean {
        const key = proxy.name;
        return this.__proxiesMap.has(key);
    }

    public retrieveProxy<T>(proxy: new () => Proxy<T>): Proxy<T> {
        const key = proxy.name;
        return this.__proxiesMap.get(key);
    }
}
