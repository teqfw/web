/**
 * Registry for reverse events streams.
 *
 * @namespace TeqFw_Web_Back_Mod_Event_Reverse_Registry
 */
export default class TeqFw_Web_Back_Mod_Event_Reverse_Registry {

    constructor(spec) {
        // DEPS
        /** @type {typeof TeqFw_Web_Back_Mod_Event_Reverse_Stream.STATE} */
        const STATE = spec['TeqFw_Web_Back_Mod_Event_Reverse_Stream.STATE$'];

        // VARS
        /** @type {Object<string, TeqFw_Web_Back_Mod_Event_Reverse_Stream>} */
        const _store = {}; // internal store for connection objects (stream UUID is the key)
        /** @type {Object<string, string>} */
        const _mapUUIDFrontToStream = {}; // map to get stream UUID for front app UUID

        // DEFINE INSTANCE METHODS
        /**
         * Delete connection data from registry.
         * @param {string} streamUUID
         */
        this.delete = function (streamUUID) {
            if (_store[streamUUID]) {
                const frontUUID = _store[streamUUID].frontId;
                delete _mapUUIDFrontToStream[frontUUID];
                delete _store[streamUUID];
            }
        }

        /**
         * Get connection object by stream UUID.
         * @param {string} uuid
         * @param {boolean} [activeOnly]
         * @return {TeqFw_Web_Back_Mod_Event_Reverse_Stream|null}
         */
        this.get = (uuid, activeOnly = true) => {
            let res;
            const found = _store[uuid];
            if (found)
                if (activeOnly === false) res = found;
                else if ((activeOnly === true) && (found.state === STATE.ACTIVE))
                    res = found;
            return res;
        }

        /**
         * Return all active streams.
         * @return {TeqFw_Web_Back_Mod_Event_Reverse_Stream[]}
         */
        this.getAll = () => {
            const res = [];
            /** @type {TeqFw_Web_Back_Mod_Event_Reverse_Stream[]} */
            const streams = Object.values(_store);
            for (const one of streams)
                if (one.state === STATE.ACTIVE) res.push(one);

            return res;
        }
        /**
         * Get connection object by front application UUID.
         * @param {string} uuid
         * @param {boolean} [activeOnly]
         * @return {TeqFw_Web_Back_Mod_Event_Reverse_Stream|null}
         */
        this.getByFrontUUID = function (uuid, activeOnly = true) {
            const streamUUID = _mapUUIDFrontToStream[uuid]
            return this.get(streamUUID, activeOnly);
        }

        /**
         * Get frontUUID by stream UUID
         * @param {string} streamUUID
         * @return {string}
         */
        this.mapUUIDStreamToFront = function (streamUUID) {
            return _store[streamUUID]?.frontId;
        }
        /**
         * Put connection to the registry.
         * @param {TeqFw_Web_Back_Mod_Event_Reverse_Stream} conn
         * @param {string} streamUUID
         * @param {string} frontUUID
         */
        this.put = function (conn, streamUUID, frontUUID) {
            if (_store[streamUUID])
                throw new Error(`Cannot registry reverse stream with duplicated UUID: ${streamUUID}.`);
            conn.frontId = frontUUID;
            conn.streamId = streamUUID;
            _store[streamUUID] = conn;
            _mapUUIDFrontToStream[frontUUID] = streamUUID;
        }

    }
}
