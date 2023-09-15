/**
 * Factory to load plugins descriptors and to create handlers.
 *
 * @namespace TeqFw_Web_Back_App_Server_Listener_Socket_A_HndlFactory
 */
export default class TeqFw_Web_Back_App_Server_Listener_Socket_A_HndlFactory {
    /**
     * @param {TeqFw_Di_Api_Container} container
     * @param {TeqFw_Web_Back_Defaults} DEF
     * @param {TeqFw_Core_Back_Api_Plugin_Registry} modPlugins
     * @param {TeqFw_Web_Back_Plugin_Dto_Desc} dtoDesc
     */
    constructor(
        {
            container,
            TeqFw_Web_Back_Defaults$: DEF,
            TeqFw_Core_Back_Api_Plugin_Registry$: modPlugins,
            TeqFw_Web_Back_Plugin_Dto_Desc$: dtoDesc,
        }) {

        // VARS

        // INSTANCE METHODS

        this.createHandlers = async function () {
            // FUNCS

            // MAIN
            const res = [];
            // get socket handlers definitions from plugins descriptors
            /** @type {Object<string, TeqFw_Web_Back_Plugin_Dto_Desc_Socket.Dto>} */
            const includes = {};
            const plugins = modPlugins.items();
            for (const plugin of plugins) {
                /** @type {TeqFw_Web_Back_Plugin_Dto_Desc.Dto} */
                const desc = dtoDesc.createDto(plugin.teqfw[DEF.SHARED.NAME]);
                for (const name of Object.keys(desc.sockets))
                    includes[name] = desc.sockets[name];
            }
            // TODO: arrange handlers by before-after
            for (const name of Object.keys(includes)) {
                /** @type {TeqFw_Web_Back_Api_Listener_Socket} */
                const handler = await container.get(`${name}$`);
                if (typeof handler.init === 'function') await handler.init();
                res.push(handler);
            }
            return res;
        }
    }
}