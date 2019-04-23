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

    public registerProxy<D, P extends Proxy<D>>(proxy: new () => P): P {
        const proxyInstance = new proxy();
        const name = proxyInstance.constructor.name;
        this.__proxiesMap.set(name, proxyInstance);
        proxyInstance.onRegister(this.__facade);
        return proxyInstance;
    }

    public removeProxy<D, P extends Proxy<D>>(proxy: new () => P): void {
        if (!this.hasProxy(proxy)) {
            return;
        }

        const key = proxy.name;
        let proxyInstance = this.__proxiesMap.get(key);
        this.__proxiesMap.delete(key);

        proxyInstance.onRemove();
    }

    public hasProxy<D, P extends Proxy<D>>(proxy: new () => P): boolean {
        const key = proxy.name;
        return this.__proxiesMap.has(key);
    }

    public retrieveProxy<D, P extends Proxy<D>>(proxy: new () => P): P {
        const key = proxy.name;
        return this.__proxiesMap.get(key) as P;
    }
}
