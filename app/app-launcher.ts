import { _decorator, Component, director, game, Node } from 'cc';
import { AppModules } from './app-modules';
import { EventModule } from '../event/event-module';
import { FluxModule } from '../flux/flux-module';
import { SingleModule } from '../singleton/single-module';
import { AssetModule } from '../asset/asset-module';

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
        this._persist = new Node("AppPersistNode");
        director.addPersistRootNode(this._persist);

        // 模塊初始化
        this.initModules();
    }

    /**
     * 初始化各模組
     */
    private initModules(): void {
        AppModules.asset = new AssetModule();
        AppModules.event = new EventModule();
        AppModules.flux = new FluxModule();
        AppModules.single = new SingleModule();
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
        AppModules.single = new SingleModule();
        AppModules.single = null;

        AppModules.flux.shutdown();
        AppModules.flux = null;

        AppModules.event.shutdown();
        AppModules.event = null;

        AppModules.asset.shutdown();
        AppModules.asset = null;
    }
}
