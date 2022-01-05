/**
 * Registry for reverse events streams.
 *
 * @namespace TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Registry
 */
export default class TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Registry {

    constructor() {

        // DEFINE WORKING VARS / PROPS
        /** @type {Object<string, TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Stream>} */
        const _store = {}; // internal store for connection objects (stream UUID is the key)
        /** @type {Object<string, string>} */
        const _mapUUIDFrontToStream = {}; // map to get stream UUID for front app UUID

        // DEFINE INSTANCE METHODS
        /**
         * Delete connection data from registry.
         * @param connUUID
         */
        this.delete = function (connUUID) {
            if (_store[connUUID]) {
                const frontUUID = _store[connUUID].frontId;
                delete _mapUUIDFrontToStream[frontUUID];
                delete _store[connUUID];
            }
        }

        /**
         * Get connection object by stream UUID.
         * @param {string} uuid
         * @return {TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Stream|null}
         */
        this.get = (uuid) => _store[uuid];

        /**
         * Get connection object by front application UUID.
         * @param {string} uuid
         * @return {TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Stream|null}
         */
        this.getByFrontUUID = function (uuid) {
            return (_mapUUIDFrontToStream[uuid] && _store[_mapUUIDFrontToStream[uuid]])
                ? _store[_mapUUIDFrontToStream[uuid]] : null;
        }

        /**
         * Put connection to the registry.
         * @param {TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Stream} conn
         * @param {string} streamUUID
         * @param {string} frontUUID
         */
        this.put = function (conn, streamUUID, frontUUID) {
            if (_store[streamUUID])
                throw new Error(`Cannot registry reverse stream with duplicated UUID: ${streamUUID}.`);
            _store[streamUUID] = conn;
            _mapUUIDFrontToStream[frontUUID] = streamUUID;
        }

    }
}
