import { _decorator, Component, Node, screen, UITransform, view } from 'cc';
import { AppModules } from '../../app/app-modules';

const { ccclass, property, requireComponent, menu } = _decorator;

/**
 * 觸發適配事件
 * @summary 使用此元件須設定成定寬高(show all)模式, 方便元件計算變化
 */
@ccclass
@menu("custom/adapt/canvas adapt")
export class CanvasAdapt extends Component {
	/**
	 * 
	 */
	protected onLoad(): void {
		screen.on("window-resize", this.onTrigger, this);
		screen.on("orientation-change", this.onTrigger, this);
		screen.on("fullscreen-change", this.onTrigger, this);
		view.on("canvas-resize", this.onTrigger, this);
	}

	/**
	 * 
	 */
	protected onDestroy(): void {
		screen.off("window-resize", this.onTrigger, this);
		screen.off("orientation-change", this.onTrigger, this);
		screen.off("fullscreen-change", this.onTrigger, this);
		view.off("canvas-resize", this.onTrigger, this);
	}

	/**
	 * 觸發事件
	 */
	protected onTrigger(): void {
        AppModules.event.emit("VIEW_ADJUST");
	}
}
