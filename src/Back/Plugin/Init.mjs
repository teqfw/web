/**
 * Plugin initialization function.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Plugin_Init';

export default function Factory(spec) {
    // DEPS
    /** @type {TeqFw_Di_Shared_Container} */
    // const container = spec['TeqFw_Di_Shared_Container$'];

    // FUNCS
    async function action() {

    }

    // MAIN
    Object.defineProperty(action, 'namespace', {value: NS});
    return action;
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'namespace', {value: NS});
