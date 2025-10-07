import { FluxAction, FluxEvent } from "./flux-action";
import { FluxDispatcher } from "./flux-dispatcher";
import { FluxStore } from "./flux-store";

/**
 * module專用的store
 * @summary 用來限制store必須具備下列功能
 */
interface ModuleStore<T extends FluxStore> {
    /**
     * 名稱
     */
    name: string;

    /**
     * 建構子
     */
    new(dispatcher: FluxDispatcher): T;
}

/**
 * flux模塊
 */
export class FluxModule {
    /**
     * store列表
     */
    private declare _stores: Map<string, FluxStore>;

    /**
     * 行為派發
     */
    private declare _dispatcher: FluxDispatcher;

    /**
     * 
     */
    constructor() {
        this._stores = new Map();
        this._dispatcher = new FluxDispatcher();
    }

    /**
     * 關閉系統
     */
    shutdown(): void {
        this._dispatcher.shutdown();
        this._dispatcher = null;

        this._stores.forEach(store => {
            store.shutdown();
            store = null;
        });
        this._stores.clear();
    }

    /**
     * 取得store
     * @param type store類型
     * @summary 不存在時會先執行創建store
     */
    getStore<T extends FluxStore>(type: ModuleStore<T>): T {
        if (!this._stores.has(type.name)) {
            this.createStore(type);
        }
        
        return this._stores.get(type.name) as T;
    }

    /**
     * 關注store變化
     * @param type store類型
     * @param event 事件
     * @param once 是否只觸發單次
     */
    focusStore<T extends FluxStore>(type: ModuleStore<T>, event: FluxEvent, once: boolean = false): void {
        this.getStore(type).on(event, once);
    }

    /**
     * 取消關注store變化
     * @param type store類型
     * @param event 事件
     */
    blurStore<T extends FluxStore>(type: ModuleStore<T>, event: FluxEvent): void {
        this.getStore(type)?.off(event);
    }

    /**
     * 創建store
     * @param type store類型
     */
    private createStore<T extends FluxStore>(type: ModuleStore<T>): T {
        if (this._stores.has(type.name)) {
            return this._stores.get(type.name) as T;
        }

        let store = new type(this._dispatcher);
        this._stores.set(type.name, store);
        return store;
    }

    /**
     * 將action廣播給所有store
     */
    castAction(action: FluxAction): void {
        this._dispatcher.broadcast(action);
    }
}
