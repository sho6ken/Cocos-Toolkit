import { NetBuf, NetCmd, NetConnOpt, NetHandler } from "./net-base";
import { NetNode } from "./net-node";

/**
 * 連線管理
 */
export class NetModule {
    /**
     * 連線頻道
     */
    private _channels = new Map<number, NetNode>();

    /**
     * 關閉系統
     */
    shutdown(): void {
        Array.from(this._channels.keys()).forEach(item => this.rmoveChannel(item), this);
        this._channels.clear();
    }

    /**
     * 新增頻道
     * @param node 連線節點
     * @param id 頻道編號
     */
    addChannel(node: NetNode, id: number = 0): boolean {
        if (this._channels.has(id)) {
            console.warn(`net module add channel ${id} failed, id repeat.`);
            return false;
        }

        this._channels.set(id, node);
        console.log(`net module add channel ${id} succeed.`);

        return true;
    }

    /**
     * 移除頻道
     * @param id 頻道編號
     */
    rmoveChannel(id: number = 0): void {
        if (!this._channels.has(id)) {
            return;
        }

        let node = this._channels.get(id);
        node?.closeConn();
        node = null;
        this._channels.delete(id);

        console.log(`net module remove channel ${id} succeed.`);
    }

    /**
     * 頻道連線
     * @param opt 連線參數
     * @param id 頻道編號
     */
    openChannel(opt: NetConnOpt, id: number = 0): boolean {
        if (!this._channels.has(id)) {
            console.warn(`net module open channel ${id} failed, id not found.`);
            return false;
        }

        return this._channels.get(id).startConn(opt);
    }

    /**
     * 頻道斷線
     * @param id 頻道編號
     */
    closeChannel(id: number = 0): void {
        if (!this._channels.has(id)) {
            console.warn(`net moudle close channel ${id} failed, id not found.`);
            return;
        }

        this._channels.get(id).closeConn();
    }

    /**
     * 發送訊息
     * @param cmd 協議編號
     * @param buf 數據內容
     * @param id 頻道編號
     */
    sendMsg(cmd: NetCmd, buf: NetBuf, id: number = 0): boolean {
        if (!this._channels.has(id)) {
            console.warn(`net module send msg ${cmd} failed, channel ${id} not found.`, buf);
            return false;
        }

        return this._channels.get(id).sendMsg(cmd, buf);
    }

    /**
     * 發送請求
     * @param cmd 協議編號
     * @param buf 數據內容
     * @param resp 回應處理
     * @param id 頻道編號
     */
    sendReq(cmd: NetCmd, buf: NetBuf, resp: NetHandler, id: number = 0): void {
        if (!this._channels.has(id)) {
            console.warn(`net module send req ${cmd} failed, channel ${id} not found.`, buf);
            return;
        }

        this._channels.get(id).sendReq(cmd, buf, resp);
    }

    /**
     * 發送唯一請求
     * @param cmd 協議編號
     * @param buf 數據內容
     * @param resp 回應處理
     * @param id 頻道編號
     */
    sendUnique(cmd: NetCmd, buf: NetBuf, resp: NetHandler, id: number = 0): boolean {
        if (!this._channels.has(id)) {
            console.warn(`net module send unique ${cmd} failed, channel ${id} not found.`, buf);
            return false;
        }

        return this._channels.get(id).sendUnique(cmd, buf, resp);
    }
}
