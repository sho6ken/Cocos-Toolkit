import { _decorator, Component, Node, sp } from 'cc';

const { ccclass, property, requireComponent, menu, disallowMultiple } = _decorator;

/**
 * spine動畫事件
 * @param name 事件名稱
 */
export type SpinAnimEvent = (name: string) => void;

/**
 * spine控制
 */
@ccclass
@disallowMultiple
@requireComponent(sp.Skeleton)
@menu(`custom/spine ctrl`)
export class SpineCtrl extends Component {
    /**
     * spine anim track
     */
    static readonly TRACK = 99;

    /**
     * spine
     */
    private declare _spine: sp.Skeleton;

    /**
     * 
     */
    protected onLoad(): void {
        this._spine = this.getComponent(sp.Skeleton); 
    }

    /**
     * 初始化
     * @param data 骨骼資料
     */
    init(data: sp.SkeletonData): void {
        this._spine.skeletonData = data;
    }

    /**
     * 設定播放動畫速度
     */
    setSpeed(value: number): void {
        this._spine.timeScale = value;
    }

    /**
     * 停止播放
     */
    stop(): void {
        this._spine?.clearTrack(SpineCtrl.TRACK); 
        this._spine?.setToSetupPose();
        this.resume();
    }

    /**
     * 暫停播放
     */
    pause(): void {
        this._spine && (this._spine.paused = true);
    }

    /**
     * 恢復播放
     */
    resume(): void {
        this._spine && (this._spine.paused = false);
    }

    /**
     * 單次播放
     * @param key 動畫名稱
     * @param event 動畫事件回調
     */
    async play(key: string = "default", event?: SpinAnimEvent): Promise<void> {
        this.stop();

        let entry = this._spine.setAnimation(SpineCtrl.TRACK, key, false);
        this.listen(entry, event);

        await new Promise(resolve => {
            this._spine.scheduleOnce(resolve, entry.animation.duration);
        });
    }

    /**
     * 循環播放
     * @param key 動畫名稱
     * @param event 動畫事件回調
     */
    playLoop(key: string = "default", event?: SpinAnimEvent): void {
        this.stop();

        let entry = this._spine.setAnimation(SpineCtrl.TRACK, key, true);
        this.listen(entry, event);
    }

    /**
     * 循序播放
     * @param keys 動畫名稱列表
     * @param event 動畫事件回調
     * @summary 會依照順序播放動畫
     */
    async playSteps(keys: string[], event?: SpinAnimEvent): Promise<void> {
        this.stop();

        let time = 0;

        // 計算播放所有動畫所需時間
        keys.forEach(key => {
            let entry = this._spine.setAnimation(SpineCtrl.TRACK, key, false);
            this.listen(entry, event);

            time += entry.animation.duration;
        }, this);

        // 等待所有動畫播放
        if (time > 0) {
            await new Promise(resolve => {
                this._spine.scheduleOnce(resolve, time);
            });
        }
    }

    /**
     * 監聽動畫事件
     * @param cb 動畫事件回調
     */
    private listen(entry: sp.spine.TrackEntry, cb: SpinAnimEvent): void {
        if (entry == null || cb == null) {
            //console.warn(`spine ctrl listen ${this._spine.name} event failed.`);
            return;
        }

        this._spine.setTrackEventListener(entry, (entry, event) => {
            cb((<sp.spine.Event>event)?.data?.name && event.toString());
        });
    }

    /**
     * 將物件綁定骨骼
     * @param bone 骨骼名稱
     * @param node 被綁的物件
     * @summary 將該物件設定成此骨骼的子物件
     */
    bindBone(bone: string, node: Node): void {
        // @ts-ignore
        let nodes = this._spine.attachUtil.generateAttachedNodes(bone);

        if (nodes && nodes.length > 0) {
            node.parent = nodes[0];
        }
    }
}
