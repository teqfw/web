/**
 * Common gateway to Web API services.
 *
 * @namespace TeqFw_Web_Front_WAPI_Gate
 */
// MODULE'S CLASSES
export default class TeqFw_Web_Front_WAPI_Gate {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Front_Defaults} */
        const DEF = spec['TeqFw_Web_Front_Defaults$'];
        /** @type {TeqFw_Web_Front_Api_Dto_Config} */
        const config = spec['TeqFw_Web_Front_Api_Dto_Config$'];
        /** @type {TeqFw_Web_Front_Api_Gate_IAjaxLed} */
        const ajaxLed = spec['TeqFw_Web_Front_Api_Gate_IAjaxLed$'];
        /** @type {TeqFw_Web_Front_Api_Gate_IErrorHandler} */
        const errHndl = spec['TeqFw_Web_Front_Api_Gate_IErrorHandler$'];

        // DEFINE WORKING VARS / PROPS
        let BASE;

        // DEFINE INNER FUNCTIONS
        function getBaseUrl() {
            if (!BASE) {
                const schema = '//';
                const domain = config.urlBase ?? location.hostname;
                let port = location.port; // empty string for default ports (80 & 443)
                if (port !== '') port = `:${port}`
                const root = (config.root) ? `/${config.root}` : '';
                const door = (config.door) ? `/${config.door}` : '';
                const space = `/${DEF.SHARED.SPACE_API}`;
                BASE = `${schema}${domain}${port}${root}${door}${space}`;
            }
            return BASE;
        }

        // DEFINE INSTANCE METHODS
        /**
         * Send API service request to backend.
         *
         * @param {Object} data JS-object to be sent as request
         * @param {TeqFw_Web_Back_Api_WAPI_IRoute} factory
         * @returns {Promise<*|boolean>}
         */
        this.send = async function (data, factory) {
            let result = false;
            ajaxLed.on();
            try {
                const URL = `${getBaseUrl()}${factory.getRoute()}`;
                const res = await fetch(URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({data})
                });
                const text = await res.text();
                try {
                    const json = JSON.parse(text);
                    result = factory.createRes(json.data);
                } catch (e) {
                    errHndl.error(text);
                }
            } catch (e) {
                errHndl.error(e);
            } finally {
                ajaxLed.off();
            }
            return result;
        }
    }
}
