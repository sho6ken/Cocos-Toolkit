import { _decorator, Component, director, game, Node } from 'cc';
import { Mud } from './app-modules';
import { FluxModule } from '../flux/flux-module';

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

        // flux
        Mud.flux = new FluxModule();
    }

    /**
     * 
     */
    protected onDestroy(): void {
        // flux
        Mud.flux?.shutdown();
        Mud.flux = null;

        // 常駐節點
        director.removePersistRootNode(this._persist);
        this._persist.destroy();
    }
}
