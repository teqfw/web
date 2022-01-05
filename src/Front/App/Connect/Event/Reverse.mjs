/**
 * Connection to SSE source (reverse event stream representation).
 * It uses SSE state model to reflect changes in connection state.
 * Connection uses frontUUID to connect to backend and saves backendUUID when connected.
 */

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EventSource/readyState
 */
const SSE_STATE = {
    CLOSED: 2,
    CONNECTING: 0,
    OPEN: 1,
};

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Core_Shared_Api_Event_IProducer
 */
export default class TeqFw_Web_Front_App_Connect_Event_Reverse {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Front_Defaults} */
        const DEF = spec['TeqFw_Web_Front_Defaults$'];
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Web_Front_Api_Event_Stream_Reverse_IState} */
        const state = spec['TeqFw_Web_Front_Api_Event_Stream_Reverse_IState$'];
        /** @type {TeqFw_Web_Front_App_UUID} */
        const frontUUID = spec['TeqFw_Web_Front_App_UUID$'];
        /** @type {TeqFw_Web_Front_App_Back_UUID} */
        const backUUID = spec['TeqFw_Web_Front_App_Back_UUID$'];
        /** @type {TeqFw_Web_Front_App_Event_Embassy} */
        const embassy = spec['TeqFw_Web_Front_App_Event_Embassy$'];
        /** @type {TeqFw_Web_Shared_App_Event_Queue_Trans_BfItem.Factory} */
        const fQueueItem = spec['TeqFw_Web_Shared_App_Event_Queue_Trans_BfItem.Factory$'];
        /** @type {TeqFw_Core_Shared_App_Event_Producer} */
        const baseProducer = spec['TeqFw_Core_Shared_App_Event_Producer$$']; // instance
        /** @type {TeqFw_Web_Front_Event_Connect_Event_Reverse_Closed} */
        const elClosed = spec['TeqFw_Web_Front_Event_Connect_Event_Reverse_Closed$'];
        /** @type {TeqFw_Web_Front_Event_Connect_Event_Reverse_Opened} */
        const elOpened = spec['TeqFw_Web_Front_Event_Connect_Event_Reverse_Opened$'];
        /** @type {TeqFw_Web_Shared_Event_Back_Stream_Reverse_Opened} */
        const esOpened = spec['TeqFw_Web_Shared_Event_Back_Stream_Reverse_Opened$'];

        // DEFINE WORKING VARS / PROPS
        /** @type {EventSource} */
        let _source;
        let _url = `./${DEF.SHARED.SPACE_EVENT_REVERSE}`;

        // MAIN FUNCTIONALITY
        Object.assign(this, baseProducer); // new base instance for every current instance
        embassy.subscribe(esOpened.getName(), onStreamOpened);

        // DEFINE INNER FUNCTIONS
        /**
         * Save backend UUID for currently connected server.
         * @param {TeqFw_Web_Shared_Event_Back_Stream_Reverse_Opened.Dto} event
         */
        function onStreamOpened(event) {
            // noinspection JSIgnoredPromiseFromCall
            backUUID.set(event.backUUID);
        }

        // DEFINE INSTANCE METHODS

        this.close = function () {
            if (_source && (_source.readyState !== SSE_STATE.CLOSED)) {
                _source.close();
                state.closed();
                this.emit(elClosed.getName(), elClosed.createDto());
                logger.info(`Reverse events stream connection is closed.`);
            }
        }

        /**
         * Open SSE connection and set handlers for input data.
         */
        this.open = function () {
            if ((_source === undefined) || (_source.readyState === SSE_STATE.CLOSED)) {
                const thisConn = this;
                const url = `${_url}/${frontUUID.get()}`;
                // open new SSE connection and add event listeners
                _source = new EventSource(url);
                // on 'open'
                _source.addEventListener('open', function () {
                    state.connected();
                    thisConn.emit(elOpened.getName(), elOpened.createDto());
                    logger.info(`New SSE connection is opened.`);
                });
                // on 'error'
                _source.addEventListener('error', function (event) {
                    if (event.eventPhase === EventSource.CLOSED) {
                        thisConn.close();
                    } else {
                        state.error(event);
                        logger.error(`Error in SSE connection (event: ${JSON.stringify(event)}).`);
                        thisConn.close();
                    }
                });
                // on 'message' (repeat event emission on the front)
                _source.addEventListener('message', function (event) {
                    try {
                        const obj = JSON.parse(event.data);
                        /** @type {TeqFw_Web_Shared_App_Event_Queue_Trans_BfItem} */
                        const item = fQueueItem.create(obj);
                        logger.info(`Event message '${item.eventName}' from back '${item.backUUID}' is received.`);
                        embassy.emit(item.eventName, item.eventData);
                    } catch (e) {
                        console.error(e);
                    }
                });
            }
        }

        this.stateOpen = () => (_source?.readyState === 1);
    }
}