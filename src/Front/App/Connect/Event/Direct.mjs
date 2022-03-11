/**
 * HTTP connection to send frontend events to the server (direct event stream representation).
 * Contains connection UUID and uses SSE state model to reflect changes in connection state.
 */
export default class TeqFw_Web_Front_App_Connect_Event_Direct {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Front_Defaults} */
        const DEF = spec['TeqFw_Web_Front_Defaults$'];
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Web_Front_Api_Dto_Config} */
        const config = spec['TeqFw_Web_Front_Api_Dto_Config$'];
        /** @type {TeqFw_Web_Front_Api_Mod_Server_Connect_IState} */
        const modConn = spec['TeqFw_Web_Front_Api_Mod_Server_Connect_IState$'];
        /** @type {TeqFw_Web_Front_Mod_App_Front_Identity} */
        const frontIdentity = spec['TeqFw_Web_Front_Mod_App_Front_Identity$'];
        /** @type {TeqFw_Web_Front_Mod_App_Back_Identity} */
        const backIdentity = spec['TeqFw_Web_Front_Mod_App_Back_Identity$'];
        /** @type {TeqFw_Web_Shared_Mod_Event_Stamper} */
        const stamper = spec['TeqFw_Web_Shared_Mod_Event_Stamper$$']; // new instance
        /** @type {TeqFw_Web_Shared_Dto_Log_Meta_Event} */
        const dtoLogMeta = spec['TeqFw_Web_Shared_Dto_Log_Meta_Event$'];

        // VARS
        let _url = composeBaseUrl();

        // MAIN
        logger.setNamespace(this.constructor.name);

        // FUNCS
        /**
         * @return {string}
         */
        function composeBaseUrl() {
            const schema = '//';
            const domain = config.urlBase ?? location.hostname;
            let port = location.port; // empty string for default ports (80 & 443)
            if (port !== '') port = `:${port}`
            const root = (config.root) ? `/${config.root}` : '';
            const door = (config.door) ? `/${config.door}` : '';
            const space = `/${DEF.SHARED.SPACE_EVENT_DIRECT}`;
            return `${schema}${domain}${port}${root}${door}${space}/`; // '/efb/' key in service worker!!
        }

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message.Dto} data
         * @return {Promise<boolean>}
         */
        this.send = async function (data) {
            let result = false;
            if (modConn.isOnline())
                try {
                    const meta = data.meta;
                    const logMeta = dtoLogMeta.createDto();
                    logMeta.backUuid = backIdentity.getUUID();
                    logMeta.eventName = meta.name;
                    logMeta.eventUuid = meta.uuid;
                    logMeta.frontUuid = meta.frontUUID;
                    //
                    modConn.startActivity();
                    const eventName = meta.name;
                    stamper.initKeys(backIdentity.getServerKey(), frontIdentity.getSecretKey());
                    data.stamp = stamper.create(meta);
                    logger.info(`${meta.backUUID} => ${eventName} (${meta.uuid}) (sent)`, logMeta);
                    const res = await fetch(`${_url}/${eventName}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
                    if (res.status === 200) {
                        const text = await res.text();
                        try {
                            /** @type {TeqFw_Web_Shared_Dto_Event_Direct_Response.Dto} */
                            const eventRes = JSON.parse(text);
                            result = eventRes.success ?? false;
                            logger.info(`${meta.frontUUID} <= ${eventName} (${meta.uuid}) (done)`, logMeta);
                        } catch (e) {
                            // errHndl.error(text);
                        }
                    } else if (res.status === 403) {
                        const msg = await res.text();
                        logger.info(msg, logMeta);
                        if(meta.frontUUID) {
                            // there is front identity, but it is not found on back
                            await frontIdentity.registerOnBack();
                        }
                    }

                } catch (e) {
                    // errHndl.error(e);
                } finally {
                    modConn.stopActivity();
                }
            return result;
        }

    }
}
