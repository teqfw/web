/**
 * Common gateway to web services.
 *
 * @namespace TeqFw_Web_Front_Service_Gate
 */
// MODULE'S CLASSES
export default class TeqFw_Web_Front_Service_Gate {
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
        const BASE = makeUrl();

        // DEFINE INNER FUNCTIONS
        function makeUrl() {
            const schema = 'https://';
            const domain = config.urlBase;
            const root = (config.root) ? `/${config.root}` : '';
            const door = `/${config.door}`;
            const space = `/${DEF.SHARED.SPACE_API}`;
            return `${schema}${domain}${root}${door}${space}`;
        }

        // DEFINE INSTANCE METHODS
        /**
         * Send API service request to backend.
         *
         * @param {Object} data JS-object to be sent as request
         * @param {TeqFw_Web_Back_Api_Service_Factory_IRoute} factory
         * @returns {Promise<Object|Boolean>}
         */
        this.send = async function (data, factory) {
            let result = false;
            ajaxLed.on();
            try {
                const URL = `${BASE}${factory.getRoute()}`;
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
