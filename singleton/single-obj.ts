/**
 * 單例物件
 */
export interface SingleObj {
    /**
     * 名稱
     */
    name: string;

    /**
     * 初始化
     * @param params 初始化參數
     */
    init?(...params: any[]): any;

    /**
     * 關閉系統
     */
    shutdown?(): void;
}
