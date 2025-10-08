import { Asset } from "cc";
import { AssetLoader } from "./asset-loader";
import { BundleLoader } from "./bundle-loader";
import { FolderLoader } from "./folder-loader";
import { AssetLoadOpt } from "./asset-data";

/**
 * 資源管理器
 */
export class AssetModule {
    /**
     * 名稱
     */
    get name(): string { return this.constructor.name; }

    /**
     * 資源加載器
     */
    private declare _a: AssetLoader;

    /**
     * bundle加載器
     */
    private declare _b: BundleLoader;

    /**
     * 資料夾加載器
     */
    private declare _f: FolderLoader;

    /**
     * 
     */
    constructor() {
        this._a = new AssetLoader();
        this._b = new BundleLoader();
        this._f = new FolderLoader();
    }

    /**
     * 關閉系統
     */
    shutdown(): void {
        this._a.shutdown();
        this._b.shutdown();
    }

    /**
     * 清除閒置資源
     */
    clearAssets(): void {
        this._a.clear();
    }

    /**
     * 清除bundle相關
     * @param name bundle名稱
     */
    clearBundle(name: string): void {
        this._b.clear(name);
    }

    /**
     * 取得資源
     * @param type 資源種類 
     * @param opt 加載參數
     */
    async getAsset<T extends Asset>(type: typeof Asset, opt: AssetLoadOpt): Promise<T> {
        if (opt.bundleName) {
            await this._b.load(opt.bundleName);
        }

        return await this._a.get(type, opt);
    }

    /**
     * 加載資料夾
     * @param type 資源種類 
     * @param opt 加載參數
     */
    async loadFolder(type: typeof Asset, opt: AssetLoadOpt): Promise<void> {
        if (opt.bundleName) {
            await this._b.load(opt.bundleName);
        }

        (await this._f.load(type, opt)).forEach(elm => {
            this._a.add(elm.asset, elm.path, opt.hold);
        }, this);
    }

    /**
     * 打印資訊
     */
    print(): void {
        console.group(`print asset module`);
        this._a.print();
        this._b.print();
        console.groupEnd();
    }
}
