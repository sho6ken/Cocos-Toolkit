import { SingleObj } from "./single-obj";

/**
 * 單例種類
 * @summary 限制單例物件必須具備以下能力
 */
export interface SingleType<T extends SingleObj> {
    /**
     * 名稱
     */
    name: string;

    /**
     * 實例
     * @summary 當已有實體時不另行創建, 用在cocos component的單例
     */
    inst?: T;

    /**
     * 建構子
     */
    new(): T;
}
