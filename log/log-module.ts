import { PREVIEW } from "cc/env";
import { LogSetting, LogType } from "./log-setting";

/**
 * 日誌模塊
 * @summary 可設定旗標, 依旗標決定那些內容可以打印
 */
export class LogModule {
    /**
     * 旗標
     * @summary 依2進位制處理
     * @summary 編輯器預設全開
     */
    private _flags: number = PREVIEW ? Number.MAX_SAFE_INTEGER : 0;

    /**
     * 設定旗標
     * @param types 開放打印的種類
     */
    setFlag(...types: LogType[]): void {
        this._flags = 0;
        types && types.forEach(type => this._flags |= type, this);
    }

    /**
     * 此種類是否需打印
     */
    private opened(type: LogType): boolean {
        return (this._flags & type) != 0;
    }

    /**
     * 打印
     * @param type 種類
     * @param title 標題
     * @param msg 訊息
     */
    private print(type: LogType, title: string, msg: any): void {
        if (!this.opened(type)) {
            return;
        }

        let data = LogSetting[type];
        console.log("%c[%s][%s]%s:%o", data.color, this.getTime(), data.title, title, msg);
    }

    /**
     * 取得時間字串
     * @returns 24:60:60:999
     */
    private getTime(): string {
        let res = "";

        /**
         * 將時間字段加入回傳結果中
         * @param count 位數
         * @param split 分段符號
         */
        const func = function(time: number, count: number, split: string = "") {
            res += (Array(3).join("0") + time).slice(-count) + split;
        }

        let date = new Date();
        func(date.getHours(), 2, ":");
        func(date.getMinutes(), 2, ":");
        func(date.getSeconds(), 2, ":");
        func(date.getMilliseconds(), 3);

        return res;
    }

    /**
     * 打印標準日誌
     * @param msg 訊息
     * @param title 標題
     */
    trace(msg: any, title?: string): void {
        this.print(LogType.Trace, msg, title);
    }

    /**
     * 打印網路日誌
     * @param msg 訊息
     * @param title 標題
     */
    network(msg: any, title?: string): void {
        this.print(LogType.Network, msg, title);
    }

    /**
     * 打印業務邏輯
     * @param msg 訊息
     * @param title 標題
     */
    business(msg: any, title?: string): void {
        this.print(LogType.Business, msg, title);
    }
}
