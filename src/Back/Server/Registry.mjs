/**
 * Factory to create registry to share objects between handlers during HTTP request processing.
 * @implements TeqFw_Core_Shared_Api_Sync_IFactory
 */
export default class TeqFw_Web_Back_Server_Registry {
    constructor(spec) {
        /** @type {typeof TeqFw_Core_Shared_Mod_Map} */
        const Map = spec['TeqFw_Core_Shared_Mod_Map#'];

        this.create = function ({}) {
            return new Map();
        }
    }
}
