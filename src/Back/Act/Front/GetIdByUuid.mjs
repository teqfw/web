/**
 * Get front id by front UUID from RDB.
 *
 * @namespace TeqFw_Web_Back_Act_Front_GetIdByUuid
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Act_Front_GetIdByUuid';

// MODULE'S FUNCTIONS
export default function (spec) {
    // DEPS
    /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
    const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
    /** @type {TeqFw_Web_Auth_Back_RDb_Schema_Front} */
    const rdbFront = spec['TeqFw_Web_Auth_Back_RDb_Schema_Front$'];

    // VARS
    /** @type {typeof TeqFw_Web_Auth_Back_RDb_Schema_Front.ATTR} */
    const ATTR = rdbFront.getAttributes();

    // FUNCS
    /**
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {string} uuid front's UUID
     * @return {Promise<{id: number}>}
     * @memberOf TeqFw_Web_Back_Act_Front_GetIdByUuid
     */
    async function act({trx, uuid}) {
        /** @type {TeqFw_Web_Auth_Back_RDb_Schema_Front.Dto} */
        const one = await crud.readOne(trx, rdbFront, {[ATTR.UUID]: uuid});
        const id = one?.id;
        return {id};
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
