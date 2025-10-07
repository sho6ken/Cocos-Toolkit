import { _decorator, Component, director, game, Node } from 'cc';
import { Mud } from './app-modules';
import { FluxModule } from '../flux/flux-module';
import { EventModule } from '../event/event-module';
import { SingleModule } from '../singleton/single-module';

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

        // 事件
        Mud.event = new EventModule();

        // flux
        Mud.flux = new FluxModule();

        // 單例
        Mud.single = new SingleModule();
    }

    /**
     * 
     */
    protected onDestroy(): void {
        // 單例
        Mud.single = new SingleModule();
        Mud.single = null;

        // flux
        Mud.flux?.shutdown();
        Mud.flux = null;

        // 事件
        Mud.event?.shutdown();
        Mud.event = null;

        // 常駐節點
        director.removePersistRootNode(this._persist);
        this._persist.destroy();
    }
}
