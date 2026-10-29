// @ts-check

/**
 * @namespace TeqFw_Web_Back_ServerLifecycle
 * @description Public, read-only view of the server transport lifetime.
 */
export default class ServerLifecycle {
    /**
     * @param {object} deps
     * @param {TeqFw_Web_Back_ServerLifecycle_State} deps.state
     */
    constructor({state}) {
        Object.defineProperty(this, 'shutdownSignal', {value: state.controller.signal, enumerable: true});
        /** @type {AbortSignal} */
        this.shutdownSignal;
    }
}

/** Internal capability owned by Server. */
export class Controller {
    /**
     * @param {object} deps
     * @param {TeqFw_Web_Back_ServerLifecycle_State} deps.state
     */
    constructor({state}) {
        /** @returns {void} */
        this.beginShutdown = () => state.controller.abort();
    }
}

export const __deps__ = Object.freeze({
    default: {state: 'TeqFw_Web_Back_ServerLifecycle_State$'},
    Controller: {state: 'TeqFw_Web_Back_ServerLifecycle_State$'},
});
