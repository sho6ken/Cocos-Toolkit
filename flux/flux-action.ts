/**
 * flux行為
 */
export interface FluxAction {
    /**
     * 種類
     * @summary number是方便之後使用enum
     */
    type: string | number;

    /**
     * 內容
     * @summary 只有實作者知道內容, 因此為any
     */
    content?: any;
}

/**
 * flux事件
 */
export type FluxEvent = (action: FluxAction) => void;

