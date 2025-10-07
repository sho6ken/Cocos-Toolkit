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
     */
    init?(...params: any[]): any;

    /**
     * 關閉系統
     */
    shutdown?(...params: any[]): any;
}
