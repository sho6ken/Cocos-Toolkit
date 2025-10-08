import { Node } from "cc";

/**
 * 物件池
 */
export abstract class ObjPool<TK, TV> {
    /**
     * 名稱
     */
    get name(): string { return this.constructor.name; }

    /**
     * 物件池
     */
    protected _pool = new Map<TK, TV[]>();

    /**
     * 關閉
     */
    shutdown(): void {
        Array.from(this._pool.keys()).forEach(key => this.clear(key));
        this._pool.clear();
    }

    /**
     * 清除物件
     */
    clear(key: TK): void {
        if (!this._pool.has(key)) {
            console.warn(`obj pool ${this.name} clear failed, key not found.`, key);
            return;
        }

        let items = this._pool.get(key);

        items.forEach(item => {
            (item as Node).destroy();
            item = null;
        });

        items.length = 0;
        this._pool.delete(key);
    }

    /**
     * 取得物件數量
     */
    size(key: TK): number {
        return this._pool.has(key) ? this._pool.get(key).length : 0;
    }

    /**
     * 取得物件
     */
    async fetch(key: TK): Promise<TV> {
        let pool = this._pool.get(key);

        if (!pool || pool.length <= 0) {
            return await this.spawn(key);
        }

        return pool.shift();
    }

    /**
     * 生成物件
     */
    protected abstract spawn(key: TK): Promise<TV>;

    /**
     * 回收物件
     */
    recycle(value: TV, key: TK): void {
        if (!value) {
            console.warn(`obj pool ${this.name} recycle failed, value is null.`, key);
            return;
        }

        if (value instanceof Node) {
            value.removeFromParent();
        }

        if (!key) {
            if (value instanceof Node) {
                console.warn(`obj pool ${this.name} recycle failed, key not found, node will be destroy`, key, value);
                value.destroy();
            }
            return;
        }

        let pool = this._pool.get(key);

        if (!pool) {
            pool = [];
            this._pool.set(key, pool);
        }

        if (pool.indexOf(value) != -1) {
            console.warn(`obj pool ${this.name} recycle failed, value repeat.`, key, value);
            return;
        }

        pool.push(value);
    }
}
