import { Asset, assetManager, resources } from "cc";
import { AssetLoadOpt } from "./asset-data";

/**
 * 資料夾加載器
 */
export class FolderLoader {
    /**
     * 加載資料夾
     * @param type 資源種類
     * @param opt 加載參數
     */
    async load<T extends Asset>(type: typeof Asset, opt: AssetLoadOpt): Promise<{ path: string, asset: T }[]> {
        return new Promise(resolve => {
            let loader = opt.bundleName ? assetManager.getBundle(opt.bundleName) : resources;

            if (!loader) {
                console.warn(`folder loader load ${opt.bundleName}-${type.name}-${opt.assetPath} failed, loader is null.`);
                return null;
            }

            loader.loadDir(opt.assetPath, type, (e, assets) => {
                if (e) {
                    console.error(`folder loader load ${opt.bundleName}-${type.name}-${opt.assetPath} failed.`, e.message);
                    return null;
                }

                let info = loader.getDirWithPath(opt.assetPath, type);
                let res = [];

                assets.forEach((asset, idx) => {
                    res.push({ path: info[idx].path, asset: asset as T });
                });

                resolve(res);
            });
        });
    }
}
