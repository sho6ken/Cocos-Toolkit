import { FluxAction, FluxEvent } from "./flux-action";
import { FluxDispatcher } from "./flux-dispatcher";

/**
 * flux數據
 */
export abstract class FluxStore {
    /**
     * 名稱
     */
    get name(): string { return this.constructor.name; }

    /**
     * 事件列表
     */
    private declare _events: Map<FluxEvent, { once: boolean }>;

    /**
     * 
     * @param dispatcher 行為派發
     */
    constructor(dispatcher: FluxDispatcher) {
        this._events = new Map();
        dispatcher.register(action => this.subscribe(action));
    }

    /**
     * 關閉系統
     * @summary 自身
     */
    shutdown(): void {
        this._events.forEach((once, event) => this.off(event), this);
    }

    /**
     * 訂閱關注的action
     */
    protected abstract subscribe(action): void;

    /**
     * view監聽store變化
     * @param event 回調
     * @param once 是否只觸發單次
     */
    on(event: FluxEvent, once: boolean = false): void {
        if (event && !this._events.has(event)) {
            this._events.set(event, { once });
        }
    }

    /**
     * 取消監聽
     * @param event 回調
     */
    off(event: FluxEvent): void {
        this._events.has(event) && this._events.delete(event);
    }

    /**
     * 派發事件
     */
    protected emit(action: FluxAction): void {
        let list = [];

        this._events.forEach((data, event) => {
            event(action);
            data.once && list.push(event);
        });

        list.forEach(event => this.off(event), this);
    }
}
