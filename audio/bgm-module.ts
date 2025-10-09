import { _decorator, AudioClip, AudioSource, Tween, tween } from "cc";

/**
 * 音樂模塊
 */
export class BgmModule {
    /**
     * 名稱
     */
    get name(): string { return this.constructor.name; }

    /**
     * 依賴
     */
    private _depend: AudioSource = null;
    
    /**
     * 音量
     */
    private declare _vol: number;

    /**
     * 音量
     */
    get vol(): number { return this._vol; }

    /**
     * 是否已暫停
     */
    private declare _paused: boolean;

    /**
     * 是否已暫停
     */
    get paused(): boolean { return this._paused; }

    /**
     * 音量緩動
     */
    private declare _fade: Tween;

    /**
     * 是否在緩動中
     */
    private declare _fading: boolean;

    /**
     * 初始化
     * @summary 依賴
     */
    init(depend: AudioSource): void {
        this._depend = depend;
        this._vol = depend.volume;
        this._paused = false;
    }

    /**
     * 關閉
     */
    shutdown(): void {
        this.stop();
        this._depend = null;
    }

    /**
     * 設定音量
     */
    setVol(vol: number): void {
        vol = vol.limit(0, 1);

        if (vol == this.vol) {
            return;
        }

        this._vol = vol;
        this._depend.volume = vol;
    }

    /**
     * 停止
     */
    stop(): void {
        if (!this._depend.playing) {
            return;
        }

        this._depend.stop();

        if (this._fading) {
            this._fade.stop();
            this._depend.volume = this.vol;
        }
    }

    /**
     * 暫停
     */
    pause(): void {
        if (this.paused) {
            return;
        }

        this._paused = true;
        this._depend.pause();
    }

    /**
     * 續播
     */
    resume(): void {
        if (!this._paused) {
            return;
        }

        this._paused = false;
        this._depend.play();
    }

    /**
     * 播放
     * @param clip 音源
     * @param sec 音量漸變秒
     */
    play(clip: AudioClip, sec: number): void {
        if (clip == null) {
            console.warn("bgm module play failed, audio is null.");
            return;
        }

        sec = sec.limit(0, sec);

        // 執行播放
        let execute = () => {
            this._depend.clip = clip;
            this._depend.loop = true;
            this._depend.play();

            this.fadeVol(sec, 0, 1);
        };

        // 漸變至無聲後播放
        if (this._depend.playing) {
            this.fadeVol(sec, 1, 0, () => execute());
        } 
        else {
            execute();
        }
    }

    /**
     * 音量漸變
     * @param sec 漸變秒數
     * @param from 開始音量(倍率)
     * @param to 結束音量(倍率)
     * @param done 漸變完成回調
     */
    private fadeVol(sec: number, from: number, to: number, done?: Function): void {
        // 舊的先停止
        this._fade?.stop();
        this._fading = false;

        // 執行變化
        let execute = (rate) => {
            let vol = (this.vol * rate).limit(0, 1);
            this._depend.volume = vol;
        };

        // 漸變過程
        this._fade = tween({ rate: from });
        this._fade.call(() => execute(from));
        this._fade.to(sec, { rate: to }, { onUpdate: curr => execute(curr.rate) });

        // 漸變完成
        this._fade.call(() => {
            execute(to)
            done && done();

            this._fading = false;
        }, this);

        // 漸變開始
        this._fading = true;
        this._fade.start();
    }
}
