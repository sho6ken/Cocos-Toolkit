/**
 * 日誌種類
 * @summary 使用2進位制遞增編號, 1, 2, 4, 8, 16, 32...
 */
export enum LogType {
    Trace    = 1,  // 標準
    Network  = 2,  // 網路
    Business = 4,  // 業務邏輯
}

/**
 * 日誌配置
 * @param type 對齊日誌種類的編號
 * @param title 打印提示
 * @param color 打印顏色
 */
export const LogSetting: { [type: number]: { title: string, color: string } } = {
    1: { title: "trace", color: "color:#000000" },
    2: { title: "network", color: "color:#3a5fcd" },
    4: { title: "business", color: "color:#008000" },
}
