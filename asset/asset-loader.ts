import { Asset, assetManager, resources } from "cc";
import { AssetData, AssetLoadOpt } from "./asset-data";

/**
 * 資源加載器
 */
export class AssetLoader {
    /**
     * 使用中資源
     */
    private _data = new Map<string, AssetData>();

    /**
     * 現在時間
     */
    private get _currTime(): number { return Date.now() / 1000; }

    /**
     * 預計逾期時間
     */
    private get _expireTime(): number { return this._currTime + (5 * 60); }

    /**
     * 關閉系統
     */
    shutdown(): void {
        this._data.forEach(data => data.asset = null);
        this._data.clear();
    }

    /**
     * 清除閒置資源
     */
    clear(): void {
        let keys = [];

        this._data.forEach((data, key) => {
            if (!data) {
                keys.push(key);
                return;
            }

            if (!data.hold && data.expireTime < this._currTime) {
                keys.push(key);
            }
        }, this)

        keys.forEach(key => {
            this._data[key] = null;
            this._data.delete(key);
        }, this)
    }

    /**
     * 取得資源
     * @param type 資源種類 
     * @param opt 加載參數
     */
    async get<T extends Asset>(type: typeof Asset, opt: AssetLoadOpt): Promise<T> {
        if (this._data.has(opt.assetPath)) {
            let data = this._data.get(opt.assetPath);
            data.expireTime = this._expireTime;
            return data.asset as T;
        }

        let asset = await this.load(type, opt);
        this.add(asset, opt.assetPath, opt.hold);
        return asset as T;
    }

    /**
     * 加載資源
     * @param type 資源種類 
     * @param opt 加載參數
     */
    private async load<T extends Asset>(type: typeof Asset, opt: AssetLoadOpt): Promise<T> {
        return new Promise(resolve => {
            let loader = opt.bundleName ? assetManager.getBundle(opt.bundleName) : resources;

            if (!loader) {
                console.warn(`asset loader load ${opt.bundleName}-${type.name}-${opt.assetPath} failed, loader is null.`);
                return null;
            }

            loader.load(opt.assetPath, type, (e, asset) => {
                if (e) {
                    console.error(`asset loader load ${opt.bundleName}-${type.name}-${opt.assetPath} failed.`, e.message);
                    return null;
                }

                resolve(asset as T);
            });
        });
    }

    /**
     * 加入列表
     * @param asset 資源本體 
     * @param path 資源路徑
     * @param hold 是否常駐
     */
    add<T extends Asset>(asset: T, path: string, hold: boolean): void {
        this._data.set(path, { asset, hold, expireTime: this._expireTime });
    }

    /**
     * 打印資訊
     */
    print(): void {
        console.table(this._data.keys());
    }
}
