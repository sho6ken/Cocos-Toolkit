import { AssetModule } from "../asset/asset-module";
import { BgmModule } from "../audio/bgm-module";
import { EventModule } from "../event/event-module";
import { FluxModule } from "../flux/flux-module";
import { SingleModule } from "../singleton/single-module";

/**
 * app模塊
 */
export class AppModules {
    /**
     * 資源模塊
     */
    static readonly asset: AssetModule = new AssetModule();

    /**
     * 背景音樂
     */
    static readonly bgm: BgmModule = new BgmModule();

    /**
     * 事件模塊
     */
    static readonly event: EventModule = new EventModule();

    /**
     * flux模塊
     */
    static readonly flux: FluxModule = new FluxModule();

    /**
     * 單例模塊
     */
    static readonly single: SingleModule = new SingleModule();
}
