// @ts-check

/**
 * @namespace TeqFw_Web_Back_Enum_Stage
 * @description Enum-like DTO for web request processing stages.
 */
export default class Stage {
    /**
     * Creates the request-stage enumeration.
     */
    constructor() {
        this.INIT = 'INIT';
        this.PROCESS = 'PROCESS';
        this.FINALIZE = 'FINALIZE';
        Object.freeze(this);
    }
}
