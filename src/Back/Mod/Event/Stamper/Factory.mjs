/**
 * Backend factory to create event stampers to validate stamps for event messages from various fronts.
 * Created stampers are cached inside this factory.
 *
 * @implements TeqFw_Core_Shared_Api_Factory_IAsync
 */
export default class TeqFw_Web_Back_Mod_Event_Stamper_Factory {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Di_Shared_Container} */
        const container = spec['TeqFw_Di_Shared_Container$'];
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const rdb = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
        /** @type {TeqFw_Web_Back_Store_RDb_Schema_Front} */
        const rdbFront = spec['TeqFw_Web_Back_Store_RDb_Schema_Front$'];
        /** @type {TeqFw_Web_Back_Mod_Server_Key} */
        const modServerKeys = spec['TeqFw_Web_Back_Mod_Server_Key$'];

        // VARS
        /** @type {Object<string, TeqFw_Web_Shared_Mod_Event_Stamper>} */
        const _cache = {};

        // FUNCS
        /** @type {typeof TeqFw_Web_Back_Store_RDb_Schema_Front.ATTR} */
        const ATTR = rdbFront.getAttributes();

        // INSTANCE METHODS
        /**
         * @param {string} frontUuid
         * @return {Promise<TeqFw_Web_Shared_Mod_Event_Stamper>}
         */
        this.create = async function ({frontUuid}) {
            // VARS


            // FUNCS
            /**
             * Load front's public key from RDB.
             * @param {string} uuid front UUID
             * @return {Promise<string>}
             */
            async function getPublicKey(uuid) {
                let res;
                const trx = await rdb.startTransaction();
                try {
                    /** @type {TeqFw_Web_Back_Store_RDb_Schema_Front.Dto} */
                    const one = await crud.readOne(trx, rdbFront, {[ATTR.UUID]: uuid});
                    res = one?.key_pub;
                    await trx.commit();
                } catch (e) {
                    logger.error(e?.message);
                    await trx.rollback();
                }
                return res
            }

            // MAIN
            if (!_cache[frontUuid]) {
                /** @type {TeqFw_Web_Shared_Mod_Event_Stamper} */
                const stamper = await container.get('TeqFw_Web_Shared_Mod_Event_Stamper$$'); // new instance
                const sec = await modServerKeys.getSecret();
                const pub = await getPublicKey(frontUuid);
                if (sec && pub) {
                    stamper.initKeys(pub, sec);
                    _cache[frontUuid] = stamper;
                } // else: there is no public key for given front
            }
            return _cache[frontUuid];
        }
    }
}
