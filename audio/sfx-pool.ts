import { AudioSource, Component, Node } from "cc";
import { ObjPool } from "../pool/obj-pool";
import { SfxAudio } from "./sfx-audio";

/**
 * 音效池
 */
export class SfxPool extends ObjPool<typeof AudioSource, SfxAudio> {
    /**
     * 計數器
     */
    private static _count: number = 0;

    /**
     * 音效池使用者
     */
    private _owner: Node = null;

    /**
     * 初始化
     * @param owner 音效池使用者, 使用無其他業務影響的乾淨節點
     */
    init(owner: Node): void {
        SfxPool._count = 0;
        this._owner = owner;
    }

    /**
     * 關閉
     */
    shutdown(): void {
        this._owner.removeAllChildren();
        this._owner = null;

        super.shutdown();
    }

    /**
     * 生成物件
     */
    protected async spawn(key: typeof AudioSource): Promise<SfxAudio> {
        let node = new Node();
        this._owner.addChild(node);

        let audio = node.addComponent(SfxAudio);
        audio.init(SfxPool._count++);
        audio.onComplete = this.onComplete.bind(this);

        return audio;
    }

    /**
     * 播放完畢
     */
    private onComplete(cmpt: SfxAudio): void {
        this.recycle(cmpt, SfxAudio);
    }
}
