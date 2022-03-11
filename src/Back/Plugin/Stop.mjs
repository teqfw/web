/**
 * Plugin finalization function.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Plugin_Stop';

export default function Factory(spec) {
    // DEPS
    /** @type {TeqFw_Db_Back_RDb_IConnect} */
    const connect = spec['TeqFw_Db_Back_RDb_IConnect$'];

    // COMPOSE RESULT
    async function exec() {
        // web-plugin works with DB, so we need to disconnect from RDBMS
        await connect.disconnect();
    }

    Object.defineProperty(exec, 'name', {value: `${NS}.${exec.name}`});
    return exec;
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
