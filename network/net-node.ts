import { NetBuf, NetCmd, NetConnOpt, NetEvent, NetHandler, NetHelper, NetHint, NetReq, NetSocket, NetState } from "./net-base";

/**
 * 連線節點
 */
export class NetNode {
    /**
     * 連線狀態
     */
    private declare _state: NetState;

    /**
     * socket
     */
    private declare _socket: NetSocket;

    /**
     * socket是否已設定完畢
     */
    private declare _ready: boolean;

    /**
     * 數據處理助手
     */
    private declare _helper: NetHelper;

    /**
     * 請求列表
     */
    private declare _requests: NetReq[];

    /**
     * 協議處理列表
     */
    private declare _handlers: Map<NetCmd, NetHandler[]>;

    /**
     * 連線參數
     */
    private declare _connOpt: NetConnOpt;

    /**
     * 心跳計時器
     */
    private declare _hbTimer: number;

    /**
     * 斷線計時器
     */
    private declare _disconnTimer: number;

    /**
     * 重連計時器
     */
    private declare _reconnTimer: number;

    /**
     * 連線提示
     */
    private declare _hint: NetHint;

    /**
     * 剩餘重連次數
     */
    private declare _chances: number;

    /**
     * 
     * @param helper 數據處理助手
     * @param hint 連線提示(介面用)
     */
    constructor(socket: NetSocket, helper: NetHelper, hint?: NetHint) {
        this._state = NetState.Closed;
        this._socket = socket;
        this._ready = false;
        this._helper = helper;
        this._requests = [];
        this._handlers = new Map();
        this._hint = hint;
        this._hbTimer = -1;
        this._disconnTimer = -1;
        this._reconnTimer = -1;
    }

    /**
     * 開始連線
     * @param opt 連線參數
     */
    startConn(opt: NetConnOpt): boolean {
        if (this._state != NetState.Closed) {
            console.warn(`net node start conn ${opt.addr} failed, in wrong state ${this._state}.`);
            return false;
        }

        console.log(`net node start conn ${opt.addr}.`);
        this._state = NetState.Connecting;

        // 初始化socket
        this.initSocket();
        
        this._hint?.onConnecting(true);

        // 連線失敗
        if (!this._socket.connect(opt)) {
            this._hint?.onConnecting(false);
            return false;
        }

        this._connOpt = opt;
        this._chances = opt.chances;

        return true;
    }

    /**
     * socket初始化
     */
    private initSocket(): void {
        if (this._ready) {
            return;
        }

        this._ready = true;

        this._socket.onMsg = this.onMsg.bind(this);
        this._socket.onConnect = this.onConnect.bind(this);
        this._socket.onErr = this.onErr.bind(this);
        this._socket.onClose = this.onClose.bind(this);
    }

    /**
     * 收到訊息
     */
    private onMsg(buf: NetBuf): void {
        // 非法數據
        if (!this._helper.isLegal(buf)) {
            console.warn("net node rcv msg illegal.", buf);
            return;
        }

        this.resetDisconnTimer();
        this.resetHBTimer();

        let cmd = this._helper.getCmd(buf);
        console.log(`net node rcv msg ${cmd}.`, buf);

        // 觸發請求
        for (const idx in this._requests) {
            let req = this._requests[idx];

            if (req.cmd == cmd) {
                req.resp.event.call(req.resp.sender, cmd, buf);
                this._requests.splice(Number(idx), 1);
                break;
            }
        }

        // 尚有其他請求
        let len = this._requests.length;
        this._hint?.onRequesting(len > 0);

        // 觸發事件
        let handlers = this._handlers.get(cmd);
        handlers?.forEach(handler => handler.event.call(handler.sender, cmd, buf));
    }

    /**
     * 連線成功
     */
    private onConnect(event: any): void {
        console.log(`net node conn ${this._connOpt.addr} succeed.`);

        this.clearTimers();

        this._hint?.onConnecting(false);
        this._hint?.onReconnecting(false);

        this._state = NetState.Resending;

        // 重送所有請求
        if (true) {
            let len = this._requests.length;
            this._hint?.onRequesting(len > 0);

            console.warn(`net node start resend ${this._connOpt.addr}, size ${len}.`);

            this._requests.forEach(req => this._socket.sendMsg(req.buf), this);
        }

        this._state = NetState.Connected;
            this._chances = this._connOpt.chances;
    }

    /**
     * 連線異常
     */
    private onErr(event: any): void {
        console.error(`net node conn ${this._connOpt.addr} err.`, event);
    }

    /**
     * 連線中斷
     */
    private onClose(event: any): void {
        // 還在重連中
        if (this._reconnTimer != -1) {
            return;
        }

        this._hint?.onReconnecting(true);
        this.clearTimers();

        // 開始重連
        this._reconnTimer = window.setTimeout(() => {
            this._state = NetState.Closed;

            // 無剩餘重連次數
            if (this._chances <= 0) {
                console.warn(`net node reconn ${this._connOpt.addr} failed, run out of chances.`);
                this.clearTimers();
                return;
            }

            console.warn(`net node start reconn ${this._connOpt.addr}.`);

            this._socket.disconnect();
            this.startConn(this._connOpt);

            this._chances--;
        }, 5 * 100);
    }

    /**
     * 關閉連線
     * @param code 錯誤碼
     * @param reason 錯誤原因
     */
    closeConn(code?: number, reason?: string): void {
        console.warn(`net node close conn ${this._connOpt.addr}, ${code}-${reason}.`);

        this.clearTimers();

        this._socket.onMsg = null;
        this._socket.onConnect = null;
        this._socket.onErr = null;
        this._socket.onClose = null;

        this._state = NetState.Closed;
        this._ready = false;

        this._handlers.forEach(list => list = []);
        this._handlers.clear();

        this._requests = [];

        this._hint?.onConnecting(false);
        this._hint?.onReconnecting(false);
        this._hint?.onRequesting(false);
    }

    /**
     * 註冊協議處理
     * @param cmd 協議編號
     * @param event 處理回調
     * @param sender 負責人
     */
    register(cmd: NetCmd, event: NetEvent, sender?: any): void {
        if (!this._handlers.has(cmd)) {
            this._handlers.set(cmd, []);
        }

        let handler = { sender: sender, event: event };
        this._handlers.get(cmd).push(handler);
    }

    /**
     * 發送訊息
     * @param cmd 協議編號
     * @param buf 數據內容
     */
    sendMsg(cmd: NetCmd, buf: NetBuf): boolean {
        switch (this._state) {
            // 已連線
            case NetState.Connected: {
                if (this._socket.sendMsg(buf)) {
                    console.log(`net node send msg ${cmd} to ${this._connOpt.addr} succeed.`, buf);
                    return true;
                } 
                else {
                    console.warn(`net node send msg ${cmd} to ${this._connOpt.addr} failed.`, buf);
                    return false;
                }
            }

            // 連線中或數據重送中
            case NetState.Connecting:
            case NetState.Resending: {
                let req = { cmd: cmd, buf: buf, resp: null };
                this._requests.push(req);
                console.warn(`net node send msg ${cmd} to ${this._connOpt.addr} later.`, buf);
                return true;
            }
            
            // 其他
            default:
                console.warn(`net node send msg ${cmd} to ${this._connOpt.addr} failed.`, buf);
                return false;
        }
    }

    /**
     * 發送請求
     * @param cmd 協議編號
     * @param buf 數據內容
     * @param resp 回應處理
     */
    sendReq(cmd: NetCmd, buf: NetBuf, resp: NetHandler): void {
        this._hint?.onRequesting(true);

        let req = { cmd: cmd, buf: buf, resp: resp };
        this._requests.push(req);

        if (this._state != NetState.Connected) {
            console.warn(`net node send req ${cmd} to ${this._connOpt.addr} later.`, buf);
            return;
        }

        this._socket.sendMsg(buf);
        console.log(`net node send req ${cmd} to ${this._connOpt.addr} succeed.`, buf);
    }

    /**
     * 發送唯一請求
     * @param cmd 協議編號
     * @param buf 數據內容
     * @param resp 回應處理
     */
    sendUnique(cmd: NetCmd, buf: NetBuf, resp: NetHandler): boolean {
        // 找出有無已存在請求
        for (const req of this._requests) {
            if (req.cmd == cmd) {
                console.warn(`net node send unique ${cmd} to ${this._connOpt.addr} failed, cmd repeat.`, buf);
                return false;
            }
        }

        this.sendReq(cmd, buf, resp);
        console.log(`net node send unique ${cmd} to ${this._connOpt.addr} succeed.`, buf);

        return true;
    }

    /**
     * 清除所有計時器
     */
    private clearTimers(): void {
        if (this._hbTimer == -1) {
            window.clearTimeout(this._hbTimer);
            this._hbTimer = -1;
        }

        if (this._disconnTimer == -1) {
            window.clearTimeout(this._disconnTimer);
            this._disconnTimer = -1;
        }

        if (this._reconnTimer == -1) {
            window.clearTimeout(this._reconnTimer);
            this._reconnTimer = -1;
        }
    }

    /**
     * 重設心跳計時器
     */
    private resetHBTimer(): void {
        if (this._hbTimer == -1) {
            window.clearTimeout(this._hbTimer);
            this._hbTimer = -1;
        }

        this._hbTimer = window.setTimeout(() => {
            let { cmd, buf } = this._helper.getHeartbeat();
            this.sendMsg(cmd, buf);
        }, 60 * 1000);
    }

    /**
     * 重設斷線計時器
     */
    private resetDisconnTimer(): void {
        if (this._disconnTimer == -1) {
            window.clearTimeout(this._disconnTimer);
            this._disconnTimer = -1;
        }

        this._disconnTimer = window.setTimeout(() => {
            this.closeConn();
        }, 60 * 1000);
    }
}
