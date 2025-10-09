/**
 * 事件種類
 * @summary number是方便之後使用enum
 */
export type EventType = string | number;

/**
 * 事件回調
 * @param type 事件種類
 */
export type EventCB = (type: EventType, ...params: any[]) => void;

/**
 * 事件模塊
 */
export class EventModule {
    /**
     * 事件列表
     */
    private declare _events: Map<EventType, EventCB[]>;

    /**
     * 
     */
    constructor() {
        this._events = new Map();
    }

    /**
     * 關閉系統
     */
    shutdown(): void {
        this._events.forEach((list, type) => {
            list.forEach(cb => this.off(type, cb), this);
        }, this);
        this._events.clear();
    }

    /**
     * 監聽事件
     * @param type 事件種類
     * @param cb 事件回調
     */
    on(type: EventType, cb: EventCB): void {
        if (!cb) {
            console.warn(`event module on ${type} failed, cb is null.`);
            return;
        }

        let list = this._events.get(type);

        if (!list) {
            list = [];
            this._events.set(type, list);
        }

        if (list.indexOf(cb) != -1) {
            console.warn(`event module on ${type} failed, cb ${cb.name} repeat.`);
            return;
        }

        list.push(cb);
    }

    /**
     * 取消監聽事件
     * @param type 事件種類
     * @param cb 事件回調
     */
    off(type: EventType, cb: EventCB): void {
        let list = this._events.get(type);

        if (!list || list.length <= 0) {
            console.warn(`event module off ${type} failed, type not found.`);
            return;
        }

        let idx = list.indexOf(cb);

        if (idx == -1) {
            console.warn(`event module off ${type} failed, cb ${cb.name} not found.`);
            return;
        }

        list.splice(idx, 1);

        if (list.length <= 0) {
            this._events.delete(type);
        }
    }

    /**
     * 觸發事件
     * @param type 事件種類
     */
    emit(type: EventType, ...params: any[]): void {
        this._events.get(type)?.forEach(cb => cb(type, ...params));
    }
}
