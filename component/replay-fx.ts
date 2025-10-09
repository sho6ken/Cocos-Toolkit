import { _decorator, Animation, CCBoolean, Component, ParticleSystem, ParticleSystem2D, sp } from "cc";

const { ccclass, property, menu, disallowMultiple } = _decorator;

/**
 * 特效重播
 * @summary 統一對子物件做操作
 */
@ccclass
@disallowMultiple
@menu(`custom/replay fx`)
export class ReplayFX extends Component {
    /**
     * 刷新
     */
    @property({ type: CCBoolean, displayName: "refresh" })
    private get refresh(): boolean { return false; }
    private set refresh(value: boolean) { this.search(); } 

    /**
     * 3d粒子
     */
    @property({ type: [ParticleSystem], displayName: "3d particles" })
    private p3d: ParticleSystem[] = [];

    /**
     * 2d粒子
     */
    @property({ type: [ParticleSystem2D], displayName: "2d particles" })
    private p2d: ParticleSystem2D[] = [];

    /**
     * 骨骼動畫
     */
    @property({ type: [sp.Skeleton], displayName: "spines" })
    private spines: sp.Skeleton[] = [];

    /**
     * 動畫
     */
    @property({ type: [Animation], displayName: "animations" })
    private anim: Animation[] = [];

    /**
     * 清除
     */
    private clear(): void {
        this.p3d = [];
        this.p2d = [];
        this.spines = [];
        this.anim = [];
    }

    /**
     * 搜尋所有特效
     * @summary 會略過enabled為false的組件
     */
    private search(): void {
        this.clear();

        // 通用搜尋
        let find = function<T extends Component>(type: T): T[] {
            return this.getComponentsInChildren(type).filter(cmpt => cmpt.enabled);
        }.bind(this);

        // 可再各自加入特別搜尋條件
        this.p3d = find(ParticleSystem);
        this.p2d = find(ParticleSystem2D);
        this.spines = find(sp.Skeleton);
        this.anim = find(Animation);
    }

    /**
     * 播放全部特效
     * @summary 此node的active會設定成true
     */
    play(): void {
        this.stop();

        this.p3d.forEach(elm => elm.play());
        this.p2d.forEach(elm => elm.resetSystem());

        this.spines.forEach(elm => {
            elm.setAnimation(0, "animation", elm.loop);
            elm.node.active = true;
        });

        this.anim.forEach(elm => elm.play());

        this.node.active = true;
    }

    /**
     * 停止全部特效
     * @summary 此node的active會設定成false
     */
    stop(): void {
        this.node.active = false;

        this.p3d.forEach(elm => elm.stop());
        this.p2d.forEach(elm => elm.stopSystem());
        this.spines.forEach(elm => elm.node.active = false);
        this.anim.forEach(elm => elm.stop());
    }
}
