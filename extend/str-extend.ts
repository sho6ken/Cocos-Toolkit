/**
 * 字串擴展
 */
interface String {
    /**
     * 格式化
     * @example `{0}.{1}.{2}`.format(`a`, 9) => `a.9.{2}`
     */
    format(...params: (string | number)[]): string;

    /**
     * 取代全部的目標字串
     * @param target 被取代的字串
     * @param replace 取代的字串
     */
    replaceAll(target: string, replace: string): string;

    /**
     * 字串補齊
     * @param count 顯示個數
     * @param str 填補字串 
     */
    padEnd(count: number, str: string): string;

    /**
     * 二進制轉十進制
     */
    decimal(): number;
}

/**
 * 
 */
String.prototype.format = function(this: string, ...params: (string | number)[]): string {
    return this.replace(/\{(\d+)\}/g, (src, idx) => params[idx as string]);
}

/**
 * 
 */
String.prototype.replaceAll = function(this: string, target: string, replace: string): string {
    return this.replace(new RegExp(target, "gm"), replace);
}

/**
 * 
 */
String.prototype.padEnd = function(this: string, count: number, str: string): string {
    // floor if number or convert non-number to 0
    count = count >> 0;

    str = String((typeof str !== "undefined" ? str : " "));

    if (this.length > count) {
        return String(this);
    }
    else {
        count = count - this.length;

        if (count > str.length) {
            // append to original to ensure we are longer than needed
            str += str.repeat(count / str.length);
        }

        return String(this) + str.slice(0, count);
    }
}

/**
 * 
 */
String.prototype.decimal = function(this: string): number {
    return parseInt(this, 2);
}
