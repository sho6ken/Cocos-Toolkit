import { _decorator, Component, Node, screen, UITransform, view } from 'cc';
import { AppModules } from '../../app/app-modules';

const { ccclass, property, requireComponent, menu } = _decorator;

/**
 * widget適配
 * @summary 將物件縮放至滿版, 讓其他cc.widget可以貼齊螢幕四邊
 * @summary 使用此元件須設定成定寬高(show all)模式, 方便元件計算變化
 * @summary https://www.jianshu.com/p/738a8f6a2ec1
 */
@ccclass
@requireComponent(UITransform)
@menu("custom/adapt/widget adapt")
export class WidgetAdapt extends Component {
	/**
	 * 初始寬
	 */
	private _initW: number = 0;

	/**
	 * 初始高
	 */
	private _initH: number = 0;

	/**
	 * 
	 */
	protected onLoad(): void {
		let trans = this.node.getComponent(UITransform);
		this._initW = trans.width;
		this._initH = trans.height;

		this.adjust();
		AppModules.event.on("VIEW_ADJUST", this.adjust.bind(this));
	}

	/**
	 * 
	 */
	protected onDestroy(): void {
		AppModules.event.off("VIEW_ADJUST", this.adjust.bind(this));
	}

	/**
	 * 調整
	 */
	protected adjust(): void {
		let viewSize = screen.windowSize;
		let viewW = viewSize.width;
		let viewH = viewSize.height;

		let scale = Math.min(
			viewW / this._initW, 
			viewH / this._initH
		);

		let realW = this._initW * scale;
		let realH = this._initH * scale;

		let trans = this.node.getComponent(UITransform);
		trans.width = this._initW * (viewW / realW);
		trans.height = this._initH * (viewH / realH);
	}
}
