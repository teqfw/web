/**
 * Service Worker functionality controller.
 */

/**
 * Marker for service worker message structure.
 * @memberOf TeqFw_Web_Front_Model_Sw_Control
 */
class Message {
    /** @type {number} */
    id;
    /** @type {*} */
    msg;
}

export default class TeqFw_Web_Front_Model_Sw_Control {
    constructor(spec) {
        const _queue = {};

        function onMessage(event) {
            // event is a MessageEvent object
            console.log(`This is app. The service worker sent me a message: ${JSON.stringify(event.data)}`);
            if (typeof _queue[event.data.id] === 'function') {
                _queue[event.data.id](`${event.data.msg}.${event.data.id}`);
            }
        }


        this.sendMessage = async function () {
            const worker = self.navigator.serviceWorker;
            const reg = await worker.ready;
            reg.active.postMessage("Hi service worker! It's app!");
            return 32;
        }

        this.send = function (data) {
            // generate message id
            const id = `${(new Date()).getTime()}`;
            return new Promise((resolve, reject) => {
                _queue[id] = resolve;
                self.navigator.serviceWorker.ready.then((reg) => {
                    reg.active.postMessage({msg: data, id});
                });
                // debugger;
            });
        }

        self.navigator.serviceWorker.addEventListener('message', onMessage);
    }

}
