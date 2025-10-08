import { SingleObj } from "./single-obj";
import { SingleType } from "./single-type";

/**
 * 單例模塊
 */
export class SingleModule {
    /**
     * 單例物件列表
     */
    private declare _container: Map<string, SingleObj>;

    /**
     * 
     */
    constructor() {
        this._container = new Map();
    }

    /**
     * 關閉系統
     */
    shutdown(): void {
        Array.from(this._container.keys()).forEach(name => this.doClose(name), this);
    }

    /**
     * 創建物件
     * @param type 單例種類
     * @param params 初始化參數
     */
    create<T extends SingleObj>(type: SingleType<T>, ...params: any[]): T {
        if (this._container.has(type.name)) {
            console.warn(`single module create ${type.name} failed, it's repeat.`);
            return this._container.get(type.name) as T;
        }

        let inst = type.inst ?? new type();
        inst.init && inst.init(...params);
        this._container.set(type.name, inst);
        return inst;
    }

    /**
     * 取得物件
     * @param type 單例種類
     */
    get<T extends SingleObj>(type: SingleType<T>): T {
        if (!this._container.has(type.name)) {
            console.warn(`single module get ${type.name} failed, do create before get.`);
            return null;
        }

        return this._container.get(type.name) as T;
    }

    /**
     * 關閉物件
     * @param type 單例種類
     */
    close<T extends SingleObj>(type: SingleType<T>): void {
        this.doClose(type.name);
    }

    /**
     * 實作關閉物件
     * @param name 物件名稱
     */
    private doClose(name: string): void {
        let inst = this._container.get(name);

        if (!inst) {
            console.warn(`single module close ${name} failed, inst not found.`);
            return;
        }

        inst.shutdown && inst.shutdown();
        this._container.delete(name);
    }
}
