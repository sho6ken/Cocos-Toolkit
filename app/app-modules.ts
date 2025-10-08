import { AssetModule } from "../asset/asset-module";
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
    static asset: AssetModule = null;

    /**
     * 事件模塊
     */
    static event: EventModule = null;

    /**
     * flux模塊
     */
    static flux: FluxModule = null;

    /**
     * 單例模塊
     */
    static single: SingleModule = null;
}
