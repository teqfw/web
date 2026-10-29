// @ts-check

/**
 * @namespace TeqFw_Web_Back_ServerLifecycle_State
 * @description Container-local server lifecycle state.
 */

/** Container-local state shared by the lifecycle observer and controller. */
export default class State {
    /** Creates a lifecycle state. */
    constructor() {
        this.controller = new AbortController();
    }
}
