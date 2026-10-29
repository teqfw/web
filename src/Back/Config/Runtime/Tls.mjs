// @ts-check

/**
 * @namespace TeqFw_Web_Back_Config_Runtime_Tls
 * @description TLS configuration facade and factory.
 */
export class Data {
    /** @type {string|undefined} */ ca;
    /** @type {string|undefined} */ cert;
    /** @type {string|undefined} */ key;
}
export default class Wrapper {
    /**
     * @param {object} deps
     * @param {TeqFw_Web_Back_Config_Runtime_State} deps.state
     */
    constructor({state}) { return state.tls; }
}
export class Factory {
    /**
     * @param {object} deps
     * @param {TeqFw_Web_Back_Config_Runtime_State} deps.state
     */
    constructor({state}) {
        /** @param {unknown} [values] @returns {void} */
        this.configure = (values = {}) => state.configure({tls: values});
        this.reset = state.reset;
        /** @returns {TeqFw_Web_Back_Config_Runtime_Tls} */
        this.freeze = () => { state.freeze(); return state.tls; };
    }
}
export const __deps__ = Object.freeze({
    default: {state: 'TeqFw_Web_Back_Config_Runtime_State$'},
    Factory: {state: 'TeqFw_Web_Back_Config_Runtime_State$'},
});
