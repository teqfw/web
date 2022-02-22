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
        await container.get('TeqFw_Web_Back_Proc_Front_Authenticate$');
        await container.get('TeqFw_Web_Back_Proc_Server_Key_Source$');
        await container.get('TeqFw_Web_Back_Proc_Tok$');
    }

    // MAIN
    Object.defineProperty(action, 'name', {value: `${NS}.${action.name}`});
    return action;
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
