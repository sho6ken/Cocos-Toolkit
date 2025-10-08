import { NetBuf, NetConnOpt, NetSocket } from "./net-base";

/**
 * web socket
 */
export class NetWS implements NetSocket {
    /**
     * real socket
     */
    private _socket: WebSocket = null;

    /**
     * 收到訊息
     */
    onMsg: (buf: NetBuf) => void = null;

    /**
     * 成功連線
     */
    onConnect: (event: any) => void = null;

    /**
     * 連線異常
     */
    onErr: (event: any) => void = null;

    /**
     * 連線中斷
     */
    onClose: (event: any) => void = null;

    /**
     * 發起連線
     * @param opt 連線參數
     */
    connect(opt: NetConnOpt): boolean {
        if (this._socket && this._socket.readyState == WebSocket.CONNECTING) {
            console.warn(`net ws connect to ${opt.addr} failed, already connecting.`);
            return false;
        }

        this._socket = new WebSocket(new URL(opt.addr));
        this._socket.binaryType = "arraybuffer";

        // socket event adapt
        this._socket.onmessage = event => this.onMsg(event.data);
        this._socket.onopen = this.onConnect;
        this._socket.onerror = this.onErr;
        this._socket.onclose = this.onClose;

        return true;
    }

    /**
     * 主動斷線
     * @param code 錯誤碼
     * @param reason 錯誤原因
     */
    disconnect(code?: number, reason?: string): void {
        this._socket?.close(code, reason);
    }

    /**
     * 發送訊息
     * @param buf 數據內容
     */
    sendMsg(buf: NetBuf): boolean {
        if (this._socket == null || this._socket.readyState != WebSocket.OPEN) {
            return false;
        }

        this._socket.send(buf);
        return true;
    }
}
