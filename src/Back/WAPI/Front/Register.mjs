/**
 * Register newly installed front on server.
 * We should save public key for asymmetric encryption before we open reverse Events Stream.
 *
 * @namespace TeqFw_Web_Back_WAPI_Front_Register
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_WAPI_Front_Register';

/**
 * @implements TeqFw_Web_Back_Api_WAPI_IFactory
 */
export default class TeqFw_Web_Back_WAPI_Front_Register {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Shared_WAPI_Front_Register.Factory} */
        const route = spec['TeqFw_Web_Shared_WAPI_Front_Register#Factory$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const rdb = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Web_Back_Act_Front_Create.act|function} */
        const actCreate = spec['TeqFw_Web_Back_Act_Front_Create$'];

        // DEFINE INSTANCE METHODS
        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Web_Back_App_Server_Handler_WAPI_Context} context
             */
            async function service(context) {
                /** @type {TeqFw_Web_Shared_WAPI_Front_Register.Request} */
                const req = context.getInData();
                /** @type {TeqFw_Web_Shared_WAPI_Front_Register.Response} */
                const res = context.getOutData();
                const trx = await rdb.startTransaction();
                try {
                    const {id} = await actCreate({trx, keyPub: req.publicKey, uuid: req.uuid});
                    await trx.commit();
                    res.frontId = id;
                } catch (e) {
                    console.log(e);
                    await trx.rollback();
                    throw e;
                }
            }

            // MAIN FUNCTIONALITY
            Object.defineProperty(service, 'name', {value: `${NS}.${service.name}`});
            return service;
        }
    }

}
