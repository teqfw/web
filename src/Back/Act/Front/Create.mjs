/**
 * Registry new front app in RDB.
 *
 * @namespace TeqFw_Web_Back_Act_Front_Create
 */
// MODULE'S IMPORT

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Act_Front_Create';

// MODULE'S FUNCTIONS
export default function (spec) {
    // DEPS
    /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
    const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
    /** @type {TeqFw_Web_Back_Store_RDb_Schema_Front} */
    const rdbFront = spec['TeqFw_Web_Back_Store_RDb_Schema_Front$'];

    // ENCLOSED VARS
    /** @type {typeof TeqFw_Web_Back_Store_RDb_Schema_Front.ATTR} */
    const ATTR = rdbFront.getAttributes();

    // ENCLOSED FUNCS
    /**
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {string} keyPub asymmetric public key for the front
     * @param {string} uuid front's UUID
     * @return {Promise<{id: number}>}
     * @memberOf TeqFw_Web_Back_Act_Front_Create
     */
    async function act({trx, keyPub, uuid}) {
        const data = {
            [ATTR.DATE_CREATED]: new Date(),
            [ATTR.KEY_PUB]: keyPub,
            [ATTR.UUID]: uuid,
        };
        const pk = await crud.create(trx, rdbFront, data);
        const id = pk[ATTR.ID];
        return {id};
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
