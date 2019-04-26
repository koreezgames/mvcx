import { Facade } from "./Facade";
import { Proxy } from "./Proxy";
import { MVCMap } from "./utils";

export class Model {
    private __facade: Facade;
    private __proxiesMap: MVCMap<new () => Proxy<any>, Proxy<any>>;

    constructor(facade: Facade) {
        this.__facade = facade;
        this.__proxiesMap = new MVCMap();
    }

    public registerProxy<D, P extends Proxy<D>>(proxy: new () => P): P {
        const proxyInstance = new proxy();
        this.__proxiesMap.set(proxy, proxyInstance);
        proxyInstance.onRegister(this.__facade);
        return proxyInstance;
    }

    public removeProxy<D, P extends Proxy<D>>(proxy: new () => P): void {
        if (!this.hasProxy(proxy)) {
            return;
        }

        let proxyInstance = this.__proxiesMap.get(proxy);
        this.__proxiesMap.delete(proxy);
        proxyInstance.onRemove();
    }

    public hasProxy<D, P extends Proxy<D>>(proxy: new () => P): boolean {
        return this.__proxiesMap.has(proxy);
    }

    public retrieveProxy<D, P extends Proxy<D>>(proxy: new () => P): P {
        return this.__proxiesMap.get(proxy) as P;
    }
}
