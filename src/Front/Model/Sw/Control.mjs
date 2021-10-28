/**
 * Service Worker functionality controller. Use this object on the front to communicate with Service Worker.
 */

/**
 * Marker for service worker message structure.
 * @memberOf TeqFw_Web_Front_Model_Sw_Control
 */
class Message {
    /** @type {string} */
    id;
    /** @type {*} */
    payload;
    /** @type {string} */
    type;
}

export default class TeqFw_Web_Front_Model_Sw_Control {
    constructor(spec) {
        /** @type {typeof TeqFw_Web_Front_Model_Sw_Enum_Message} */
        const MSG = spec['TeqFw_Web_Front_Model_Sw_Enum_Message$'];

        const _queue = {};

        const generateMsgId = () => `${(new Date()).getTime()}`;

        /**
         * Return SW response (payload) to consumer using callback function from queue.
         * @param {MessageEvent} event
         */
        function onMessage(event) {
            /** @type {Message} */
            const msg = event.data;
            if (typeof _queue[msg.id] === 'function') _queue[msg.id](msg.payload);
        }


        this.getCacheStatus = function () {
            const id = generateMsgId();
            return new Promise((resolve) => {
                _queue[id] = resolve;
                const msg = new Message();
                msg.id = id;
                msg.type = MSG.CACHE_STATUS_GET;
                self.navigator.serviceWorker.ready.then((reg) => reg.active.postMessage(msg));
            });
        };

        this.setCacheStatus = function (enabled = true) {
            const id = generateMsgId();
            return new Promise((resolve) => {
                _queue[id] = resolve;
                const msg = new Message();
                msg.id = id;
                msg.type = MSG.CACHE_STATUS_SET;
                msg.payload = !!enabled;
                self.navigator.serviceWorker.ready.then((reg) => reg.active.postMessage(msg));
            });
        };

        this.cacheClean = function () {
            const id = generateMsgId();
            return new Promise((resolve) => {
                _queue[id] = resolve;
                const msg = new Message();
                msg.id = id;
                msg.type = MSG.CACHE_CLEAN;
                self.navigator.serviceWorker.ready.then((reg) => reg.active.postMessage(msg));
            });
        };

        self.navigator.serviceWorker.addEventListener('message', onMessage);
    }

}
