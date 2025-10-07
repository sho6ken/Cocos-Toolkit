import { EventModule } from "../event/event-module";
import { FluxModule } from "../flux/flux-module";
import { SingleModule } from "../singleton/single-module";

/**
 * app模塊
 */
export class Mud {
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
