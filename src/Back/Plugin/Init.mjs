/**
 * Plugin initialization function.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Plugin_Init';

export default function Factory(spec) {
    // DEPS
    /** @type {TeqFw_Di_Shared_Container} */
    const container = spec['TeqFw_Di_Shared_Container$'];

    // FUNCS
    async function action() {
        await container.get('TeqFw_Web_Event_Back_Hand_Front_Authenticate$');
        await container.get('TeqFw_Web_Event_Back_Hand_Server_Key_Source$');
    }

    // MAIN
    Object.defineProperty(action, 'namespace', {value: NS});
    return action;
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'namespace', {value: NS});
