import { AudioClip, Node } from "cc";
import { SfxPool } from "./sfx-pool";
import { SfxAudio } from "./sfx-audio";

/**
 * 音效模塊
 */
export class SfxModule {
    /**
     * 名稱
     */
    get name(): string { return this.constructor.name; }

    /**
     * 音量
     */
    private declare _vol: number;

    /**
     * 音量
     */
    get vol(): number { return this._vol; }

    /**
     * 音量
     */
    set vol(value: number) { this._vol = value.limit(0, 1); }

    /**
     * 暫停前音量
     */
    private declare _pauseVol: number;

    /**
     * 暫停中
     */
    private declare _paused: boolean;

    /**
     * 暫停中
     */
    get paused(): boolean { return this._paused; }

    /**
     * 音效池
     */
    private declare _pool: SfxPool;

    /**
     * 依附的節點
     */
    private _host: Node = null;

    /**
     * 初始化
     * @param owner 音效模塊使用者
     */
    init(owner: Node) {
        this._host = new Node(this.name);
        owner.addChild(this._host);

        this._pool = new SfxPool();
        this._pool.init(this._host);

        this.vol = 1;
        this._pauseVol = 1;
        this._paused = false;
    }

    /**
     * 關閉
     */
    shutdown(): void {
        this._pool.shutdown();
        this._pool = null;

        this._host.removeFromParent();
        this._host.destroy();
        this._host = null;
    }

    /**
     * 播放
     */
    async play(clip: AudioClip): Promise<void> {
        if (!clip || this.paused) {
            return;
        }

        let audio = await this._pool.fetch(SfxAudio);
        audio.node.setParent(this._host);
        audio.playOneShot(clip, this._vol);
    }

    /**
     * 暫停
     */
    pause(): void {
        if (this.paused) {
            return;
        }

        this._paused = true;
        this._pauseVol = this.vol;
    }

    /**
     * 續播
     */
    resume(): void {
        if (!this._paused) {
            return;
        }

        this._paused = false;
        this.vol = this._pauseVol;
    }
}
