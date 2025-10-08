import { Asset } from "cc";

/**
 * 資源數據
 */
export interface AssetData {
    /**
     * 資源本體
     */
    asset: Asset;

    /**
     * 是否常駐內存不釋放
     */
    hold?: boolean;

    /**
     * 逾期時間
     */
    expireTime?: number;
}

/**
 * 資源加載參數
 */
export interface AssetLoadOpt {
    /**
     * 資源路徑
     */
    assetPath: string;

    /**
     * bundle名稱
     */
    bundleName?: string;

    /**
     * 是否常駐內存不釋放
     */
    hold?: boolean;
}
