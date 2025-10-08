import { assetManager, AssetManager } from "cc";

/**
 * bundle加載器
 */
export class BundleLoader {
    /**
     * 已加載bundle
     */
    private _bundles = new Map<string, AssetManager.Bundle>();

    /**
     * 關閉系統
     */
    shutdown(): void {
        Array.from(this._bundles.keys()).forEach(name => this.clear(name), this);
        this._bundles.clear();
    }

    /**
     * 清除bundle
     * @param name bundle名稱 
     */
    clear(name: string): void {
        if (!this._bundles.has(name)) {
            return;
        }

        let bundle = this._bundles.get(name);
        bundle.releaseAll();
        assetManager.removeBundle(bundle);
        this._bundles.delete(name);
    }

    /**
     * 加載bundle
     * @param name bundle名稱 
     */
    async load(name: string): Promise<AssetManager.Bundle> {
        return new Promise(resolve => {
            assetManager.loadBundle(name, (e, bundle) => {
                if (e) {
                    console.error(`bundle loader load ${name} failed.`, e.message);
                    return;
                }

                this._bundles.set(name, bundle);
                resolve(bundle);
            });
        });
    }

    /**
     * 打印資訊
     */
    print(): void {
        console.table(this._bundles.keys());
    }
}
