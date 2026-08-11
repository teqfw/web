// @ts-check

/**
 * @namespace TeqFw_Web_Back_Enum_Server_Type
 * @description Enum-like DTO for built-in server transport modes.
 */
export default class Type {
    /**
     * Creates the server-type enumeration.
     */
    constructor() {
        this.HTTP2 = 'http2';
        this.HTTP = 'http';
        this.HTTPS = 'https';
        Object.freeze(this);
    }
}
