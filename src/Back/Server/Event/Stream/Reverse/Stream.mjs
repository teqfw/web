/**
 * Data model for 'back-to-front' connection to send server events to the front.
 */
export default class TeqFw_Web_Back_Server_Event_Stream_Reverse_Stream {
    /**
     * Function with HTTPResponse object in own scope (closure) to close HTTP connection.
     * @type {function}
     */
    finalize;
    /**
     * Frontend application UUID.
     * @type {string}
     */
    frontId;
    /**
     * Incremental counter for event messages sent to the front.
     * @type {number}
     */
    messageId;
    /**
     * Connection state.
     * TODO: use it or remove it.
     * @type {string}
     */
    state = 'opened';
    /**
     * Stream UUID generated by backend.
     * @type {string}
     */
    streamId;
    /**
     * Function with HTTPResponse object in own scope (closure) to write out events messages.
     * @type {function}
     */
    write;
}

/**
 * @implements TeqFw_Core_Shared_Api_Sync_IFactory
 * @memberOf TeqFw_Web_Back_Server_Event_Stream_Reverse_Stream
 */
export class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castFunction|function} */
        const castFunction = spec['TeqFw_Core_Shared_Util_Cast.castFunction'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // DEFINE INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Back_Server_Event_Stream_Reverse_Stream|Object} data
         * @return {TeqFw_Web_Back_Server_Event_Stream_Reverse_Stream}
         */
        this.create = function (data = {}) {
            const res = new TeqFw_Web_Back_Server_Event_Stream_Reverse_Stream();
            res.finalize = castFunction(data.finalize);
            res.frontId = castString(data.frontId);
            res.messageId = castInt(data.messageId) || 1;
            res.state = castString(data.state);
            res.streamId = castString(data.streamId);
            res.write = castFunction(data.write);
            return res;
        }
    }
}
