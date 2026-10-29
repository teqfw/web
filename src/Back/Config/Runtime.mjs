// @ts-check

/**
 * @namespace TeqFw_Web_Back_Config_Runtime
 * @description Runtime configuration facade and factory.
 */
export class Data {
    /** @type {string|undefined} */ host;
    /** @type {number|undefined} */ port;
    /** @type {string|undefined} */ type;
    /** @type {number|undefined} */ shutdownTimeout;
    /** @type {TeqFw_Web_Back_Config_Runtime_Tls|undefined} */ tls;
}
export default class Wrapper {
    /**
     * @param {object} deps
     * @param {TeqFw_Web_Back_Config_Runtime_State} deps.state
     */
    constructor({state}) { return state.runtime; }
}
export class Factory {
    /**
     * @param {object} deps
     * @param {TeqFw_Web_Back_Config_Runtime_State} deps.state
     */
    constructor({state}) {
        this.configure = state.configure;
        this.reset = state.reset;
        this.freeze = state.freeze;
    }
}
export const __deps__ = Object.freeze({
    default: {state: 'TeqFw_Web_Back_Config_Runtime_State$'},
    Factory: {state: 'TeqFw_Web_Back_Config_Runtime_State$'},
});
