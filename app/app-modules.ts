import { EventModule } from "../event/event-module";
import { FluxModule } from "../flux/flux-module";

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
}
