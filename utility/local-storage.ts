import { sys } from "cc";

/**
 * 本地存儲
 */
export class LocalSave {
    /**
     * 存檔
     * @summary 無值時視作刪除
     */
    static save(key: string, value: any): boolean {
        if (!key || key.length <= 0) {
            return false;
        }

        if (value == null) {
            this.delSave(key);
            return true;
        }

        if (typeof value == "function") {
            return false;
        }

        if (typeof value == "object") {
            try {
                value = JSON.stringify(value);
            }
            catch (e) {
                console.error(`local storage save ${key} failed.`, value, e);
                return false;
            }
        }

        sys.localStorage.setItem(key, value);
    }

    /**
     * 讀檔
     * @param defValue 預設回傳值
     */
    static load<T>(key: string, defValue: T): T {
        if (!key || key.length <= 0) {
            return defValue;
        }

        let res = sys.localStorage.getItem(key);
        return res ?? defValue;
    }

    /**
     * 讀數值
     * @param defValue 預設回傳值
     */
    static loadNum(key: string, defValue: number = 0): number {
        return Number(this.load(key, defValue));
    }

    /**
     * 讀布林
     * @param defValue 預設回傳值
     */
    static loadBool(key: string, defValue: boolean = false): boolean {
        return Boolean(this.load(key, defValue));
    }

    /**
     * 讀字串
     * @param defValue 預設回傳值
     */
    static loadStr(key: string, defValue: string = ""): string {
        return this.load(key, defValue);
    }

    /**
     * 讀json
     * @param defValue 預設回傳值
     */
    static loadJson(key: string, defValue: object = {}): any {
        return JSON.parse(String(this.load(key, defValue)));
    }

    /**
     * 刪除
     */
    static delSave(key: string): void {
        if (!key || key.length <= 0) {
            return;
        }

        sys.localStorage.removeItem(key);
    }

    /**
     * 全部刪除
     */
    static rmrf(): void {
        sys.localStorage.clear();
    }
}
