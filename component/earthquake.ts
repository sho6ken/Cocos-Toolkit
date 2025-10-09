import { _decorator, CCFloat, CCInteger, Component, Node, tween, Tween, v2, Vec2, Vec3 } from 'cc';

const { ccclass, property, disallowMultiple, menu } = _decorator;

/**
 * 震動效果
 */
@ccclass
@disallowMultiple
@menu(`custom/earthquake`)
export class Earthquake extends Component {
    /**
     * 
     */
    @property({ type: CCFloat, displayName: "震動幅度", min: 0.01 })
    private power: number = 5;

    /**
     * 
     */
    @property({ type: CCFloat, displayName: "單次位移秒數", min: 0.01 })
    private sec: number = 0.16;

    /**
     * 
     */
    @property({ type: CCInteger, displayName: "晃動複雜度", min: 2 })
    private complex: number = 8;

    /**
     * 
     */
    private _tween: Tween = null;

    /**
     * 震動
     * @param count 震動次數
     */
    public async shake(count: number = 5): Promise<void> {
        if (count <= 1 || this.power <= 0 || this.sec <= 0) {
            return;
        }

        if (this._tween) {
            return;
        }

        let ranges = this.shakeRange();

        // 至少要有2個點才能跳動
        if (ranges.length <= 1) {
            return;
        }

        return new Promise(resolve => {
            this._tween = tween(this.node);

            // -1是讓最後一動要回到原位
            for (let i = 0; i < count - 1; i++) {
                this._tween.to(this.sec, { position: ranges.random() });
            }

            this._tween.to(this.sec, { position: Vec3.ZERO });
            this._tween.call(() => resolve());
            this._tween.start();
        });
    }

    /**
     * 取得震動範圍
     */
    private shakeRange(): Vec2[] {
        let res = [];

        for (let i = 1; i <= this.complex; i++) {
            let vec = v2(0, this.power);
            vec = vec.rotate(Math.PI / 4 * (i * 3));
            res.push(vec);
        }

        return res;
    }
}
