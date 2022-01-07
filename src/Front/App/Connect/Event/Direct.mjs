/**
 * HTTP connection to send frontend events to the server (direct event stream representation).
 * Contains connection UUID and uses SSE state model to reflect changes in connection state.
 */
// noinspection JSClosureCompilerSyntax
export default class TeqFw_Web_Front_App_Connect_Event_Direct {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Front_Defaults} */
        const DEF = spec['TeqFw_Web_Front_Defaults$'];
        /** @type {TeqFw_Web_Front_Api_Dto_Config} */
        const config = spec['TeqFw_Web_Front_Api_Dto_Config$'];


        // DEFINE WORKING VARS / PROPS
        let _url = composeBaseUrl();

        // MAIN FUNCTIONALITY


        // DEFINE INNER FUNCTIONS
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

        // DEFINE INSTANCE METHODS
        this.send = async function (data) {
            try {
                const res = await fetch(_url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                const text = await res.text();
                try {
                    const json = JSON.parse(text);
                    // result = factory.createRes(json.data);
                    const bp = true;
                } catch (e) {
                    // errHndl.error(text);
                }
            } catch (e) {
                // errHndl.error(e);
            } finally {
                // ajaxLed.off();
            }
        }

    }
}
