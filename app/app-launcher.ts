import { _decorator, AudioSource, Component, director, game, Node } from 'cc';
import { AppModules } from './app-modules';
import { FocusBlur } from '../component/focus-blur';
import { CanvasAdapt } from '../component/adapt/canvas-adapt';

const { ccclass, property } = _decorator;

/**
 * app啟動器
 */
@ccclass
export class AppLauncher extends Component {
    /**
     * 常駐節點
     */
    private _persist: Node = null;

    /**
     * 
     */
    protected onLoad(): void {
        // cocos
        game.frameRate = 60;
        //DynamicAtlasManager.instance.enabled = true;  // 不知為何, 開啟動態圖集會使apk圖片無法正常顯示

        // 常駐節點
        this._persist = new Node("Persist");
        director.addPersistRootNode(this._persist);

        // 模塊初始化
        this.initModules();
    }

    /**
     * 
     */
    protected start(): void {
        // 添加組件
        this._persist.addComponent(CanvasAdapt);
        this._persist.addComponent(FocusBlur);
        
        // 聚焦
        AppModules.event.on("VIEW_FOCUS", () => {
            director.resume();
            game.resume();
            AppModules.bgm.resume();
            AppModules.sfx.resume();
        });

        // 失焦
        AppModules.event.on("VIEW_BLUR", () => {
            director.pause();
            game.pause();
            AppModules.bgm.pause();
            AppModules.sfx.pause();
        });
    }

    /**
     * 初始化各模組
     */
    private initModules(): void {
        // 音樂
        let audioSource = this._persist.addComponent(AudioSource);
        AppModules.bgm.init(audioSource);

        // 音效
        AppModules.sfx.init(this._persist);
    }

    /**
     * 
     */
    protected onDestroy(): void {
        // 關閉模塊
        this.shutdownModules();

        // 常駐節點
        director.removePersistRootNode(this._persist);
        this._persist.destroy();
    }

    /**
     * 關閉各模塊
     */
    private shutdownModules(): void {
        AppModules.single.shutdown();
        AppModules.net.shutdown();
        AppModules.flux.shutdown();
        AppModules.event.shutdown();
        AppModules.sfx.shutdown();
        AppModules.bgm.shutdown();
        AppModules.asset.shutdown();
    }
}
