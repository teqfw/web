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
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Core_Shared_Util.isObject|function} */
        const isObject = spec['TeqFw_Core_Shared_Util.isObject'];
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
                logger.info(`SSE connection is closed.`);
            }
        }

        /**
         * Open SSE connection and set handlers for input data.
         * @param {string} url
         * @param {Object<string,function>|function}handlers
         * @return {Promise<void>}
         */
        this.open = async function (url, handlers) {
            if ((_source === undefined) || (_source.readyState === SSE_STATE.CLOSED)) {
                const me = this;
                await new Promise((resolve) => {
                    _source = new EventSource(url);
                    _source.addEventListener('open', function () {
                        logger.info(`New SSE connection is opened.`);
                        resolve();
                    });
                    _source.addEventListener('error', function (e) {
                        if (e.eventPhase === EventSource.CLOSED) {
                            me.close();
                        } else {
                            state.error(e);
                            logger.error(`Error in SSE connection (event: ${JSON.stringify(e)}).`);
                            me.close();
                        }
                    });
                    // add event handlers to connection
                    if (typeof handlers === 'function') {
                        _source.addEventListener('message', handlers);
                    } else if (isObject(handlers)) {
                        for (const key of Object.keys(handlers)) {
                            if (
                                (typeof key === 'string') &&
                                (typeof handlers[key] === 'function')
                            )
                                _source.addEventListener(key, handlers[key]);
                        }
                    }

                });
                state.connected();
            }
        }

        this.stateOpen = () => _source?.readyState === 1;
    }
}
