/**
 * Create new server keys for asymmetric encryption.
 *
 * @namespace TeqFw_Web_Back_Cli_Crypto_Key_Create
 */
// MODULE'S IMPORT
import {join} from 'path';
import {existsSync, writeFileSync} from 'fs';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Cli_Crypto_Key_Create';

// MODULE'S FUNCTIONS
/**
 * Factory to create CLI command.
 *
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 * @returns {TeqFw_Core_Back_Api_Dto_Command}
 * @constructor
 * @memberOf TeqFw_Web_Back_Cli_Crypto_Key_Create
 */
export default function Factory(spec) {
    // EXTRACT DEPS
    /** @type {TeqFw_Web_Back_Defaults} */
    const DEF = spec['TeqFw_Web_Back_Defaults$'];
    /** @type {TeqFw_Core_Back_Config} */
    const config = spec['TeqFw_Core_Back_Config$'];
    /** @type {TeqFw_Core_Shared_Api_ILogger} */
    const logger = spec['TeqFw_Core_Shared_Api_ILogger$'];
    /** @type {TeqFw_Core_Back_Api_Dto_Command.Factory} */
    const fCommand = spec['TeqFw_Core_Back_Api_Dto_Command#Factory$'];
    /** @type {TeqFw_Web_Shared_Api_Crypto_Key_IManager} */
    const mgrKey = spec['TeqFw_Web_Shared_Api_Crypto_Key_IManager$'];

    // ENCLOSED FUNCTIONS
    /**
     * Command action.
     * @returns {Promise<void>}
     * @memberOf TeqFw_Web_Back_Cli_Crypto_Key_Create
     */
    async function action() {
        logger.reset(false); // clear log and unfreeze output
        try {
            const root = config.getBoot().projectRoot;
            const path = join(root, DEF.FILE_CRYPTO_KEYS);
            if (!(existsSync(path))) {
                const keys = await mgrKey.generateAsyncKeys();
                const data = JSON.stringify(keys);
                writeFileSync(path, data);
                logger.info(`New crypto keys are stored in '${path}'.`);
            } else {
                logger.error(`There are crypto keys stored in '${path}'. Aborted.`);
            }
        } catch (error) {
            logger.error(error);
        }
    }

    Object.defineProperty(action, 'name', {value: `${NS}.action`});

    // MAIN
    const res = fCommand.create();
    res.realm = DEF.CLI_PREFIX;
    res.name = 'crypto-keys-create';
    res.desc = 'Create new server keys for asynchronous encryption.';
    res.action = action;
    return res;
}
