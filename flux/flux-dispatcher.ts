import { FluxAction, FluxEvent } from "./flux-action";

/**
 * flux行為派發
 */
export class FluxDispatcher {
    /**
     * 事件列表
     */
    private declare _events: FluxEvent[];

    /**
     * 
     */
    constructor() {
        this._events = [];
    }

    /**
     * 關閉系統
     */
    shutdown(): void {
        this._events = [];
    }

    /**
     * store註冊action事件
     * @param event 回調
     */
    register(event: FluxEvent): void {
        this._events.push(event);
    }

    /**
     * 將action廣播給所有store
     */
    broadcast(action: FluxAction): void {
        this._events.forEach(cb => cb(action));
    }
}
