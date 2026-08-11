// @ts-check

/**
 * @namespace TeqFw_Web_Back_Dto_RequestContext
 * @description Request context passed through the pipeline lifecycle.
 */
export default class RequestContext {
    /**
     * Creates an empty request context.
     */
    constructor() {
        /** @type {TeqFw_Web_Back_Request_Target} */
        this.request;

        /** @type {TeqFw_Web_Back_Response_Target} */
        this.response;

        /** @type {Record<string, unknown>} */
        this.data = {};

        /** @type {boolean} */
        this.completed = false;
    }
}

export class Factory {
    /**
     * Creates the request context factory.
     */
    constructor() {
        /**
         * @returns {TeqFw_Web_Back_Dto_RequestContext}
         */
        this.create = function () {
            return new RequestContext();
        };
    }
}
