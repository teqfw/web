/**
 * Server Sent Events connector.
 */

const SSE_STATE = {
    CLOSED: 2,
    CONNECTING: 0,
    OPEN: 1,
};

export default class TeqFw_Web_Front_SSE_Connect {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Front_Defaults} */
        const DEF = spec['TeqFw_Web_Front_Defaults$'];
        /** @type {TeqFw_Web_Front_Api_SSE_IState} */
        const state = spec['TeqFw_Web_Front_Api_SSE_IState$'];

        // DEFINE WORKING VARS / PROPS
        /** @type {EventSource} */
        let _source;

        // DEFINE INSTANCE METHODS

        this.close = function () {
            if (_source && (_source.readyState !== SSE_STATE.CLOSED)) {
                _source.close();
                state.closed();
            }
        }

        this.open = async function (url, hndlMessage) {
            if ((_source === undefined) || (_source.readyState === SSE_STATE.CLOSED)) {
                const me = this;
                const promise = new Promise((resolve) => {
                    _source = new EventSource(url);
                    _source.addEventListener('open', function () {
                        resolve();
                    });
                    _source.addEventListener('error', function (e) {
                        state.error(e);
                        me.close();
                    });
                    _source.addEventListener('message', function (e) {
                        // put input message into the band
                        // console.dir(e.data);
                        const text = e.data;
                        console.log(`SSE data is coming. State: ${_source.readyState}. Data: ${text}`);
                        try {
                            const json = JSON.parse(text);
                            hndlMessage(json);
                        } catch (e) {
                            console.log(text);
                        }

                    });
                });
                await promise;
                state.connected();
            }
        }

        this.stateOpen = () => _source?.readyState === 1;
    }
}
