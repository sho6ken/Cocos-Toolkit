import { Component } from "cc";
import { ObjPool } from "./obj-pool";

/**
 * 組件池物件
 * @summary 選配
 */
export interface CmptPoolObj {
    /**
     * 取得組件
     */
    onFetch(): void;

    /**
     * 回收組件
     */
    onRecycle(): void;
}

/**
 * 組件池
 */
export abstract class CmptPool extends ObjPool<typeof Component, Component> {
    /**
     * 取得組件
     */
    async fetch(type: typeof Component): Promise<Component> {
        let cmpt: any = await super.fetch(type);
        cmpt?.onFetch && cmpt.onFetch();
        return cmpt;
    }

    /**
     * 回收組件
     */
    recycle(cmpt: Component, type: typeof Component): void {
        (<any>cmpt)?.onRecycle && (<any>cmpt).onRecycle();
        super.recycle(cmpt, type);
    }
}
