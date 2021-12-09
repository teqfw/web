/**
 * Registry to store web requests handlers.
 * Registry orders all handlers in hierarchy taking into account their dependencies.
 * @namespace TeqFw_Web_Back_Scan_Handler_Registry
 */
export default class TeqFw_Web_Back_Scan_Handler_Registry {
    constructor() {
        /**
         * Map handlers by namespace then by event name.
         * @type {Object<string, Object<string, TeqFw_Web_Back_Scan_Handler_Listener.Dto>>}
         */
        const _byNs = {};
        /**
         * Map handlers by event name then by namespace.
         * @type {Object<string, Object<string, TeqFw_Web_Back_Scan_Handler_Listener.Dto>>}
         */
        const _byEvent = {};
        /**
         * Map of ordered listeners grouped by event.
         * @type {Object<string, function[]>}
         */
        const _orderedListeners = {};

        // DEFINE INSTANCE METHODS

        /**
         * Add one item to the registry.
         * @param {TeqFw_Web_Back_Scan_Handler_Listener.Dto} item
         */
        this.add = function (item) {
            const ns = item.ns;
            const event = item.event;
            if (!_byNs[ns]) _byNs[ns] = {};
            if (!_byEvent[event]) _byEvent[event] = {};
            _byNs[ns][event] = item;
            _byEvent[event][ns] = item;
        };

        /**
         * Order all listeners.
         */
        this.order = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * Order listeners by after/before for one event.
             * @param {string} event
             */
            function processOneEvent(event) {
                // DEFINE INNER FUNCTIONS

                /**
                 * Convert 'before/after' notation to 'dependent' notation and compose successors list for each handler
                 * for the event.
                 * @param {string} event
                 * @return Object<string, string[]>
                 */
                function initSuccessors(event) {
                    /** @type {Object<string, string[]>} */
                    const res = {}; // {root => [node, ...]}
                    // compose dependencies for event handlers
                    /** @type {Object<string, TeqFw_Web_Back_Scan_Handler_Listener.Dto>} */
                    const handlers = _byEvent[event];
                    for (const ns of Object.keys(handlers)) {
                        if (!res[ns]) res[ns] = [];
                        const handler = _byEvent[event][ns];
                        // node / this
                        for (const one of handler.after) res[ns].push(one);
                        // this / root
                        for (const one of handler.before) {
                            if (!res[one]) res[one] = [];
                            res[one].push(ns);
                        }
                    }
                    // make deps unique and delete nodes w/o dependants
                    for (const ns of Object.keys(res)) {
                        res[ns] = [...new Set(res[ns])];
                        if (res[ns].length === 0) delete res[ns];
                    }
                    return res;
                }

                /**
                 * Recursive function to update nodes weights in hierarchy.
                 * 1 - node has no deps (root), 2 - node has one dep's level below, ...
                 *
                 * Circular dependencies resolution is out of this scope.
                 *
                 * @param {string} name
                 * @param {number} weight
                 * @param {Object<string, string[]>} successors root => [node1, ...]
                 * @param {Object<string, number>} weights
                 */
                function setWeights(name, weight, successors, weights) {
                    if (weights[name]) weight = weights[name] + 1;
                    if (successors[name])
                        for (const one of successors[name]) {
                            if (weights[one]) {
                                setWeights(one, weights[one] + 1, successors, weights);
                            } else {
                                setWeights(one, 1, successors, weights);
                            }
                        }
                    weights[name] = weight;
                }

                // MAIN FUNCTIONALITY
                /** @type {Object<string, string[]>} {root => [node, ...]} */
                const successors = initSuccessors(event);
                const handlers = Object.keys(_byEvent[event]);
                /** @type {Object<string, number>} */
                const weights = {};
                for (const one of handlers) setWeights(one, 1, successors, weights);
                // convert weights to levels, some handlers may be on one level
                /** @type {Object<number, string[]>} */
                const byLevel = {};
                for (const name of Object.keys(weights)) {
                    const weight = weights[name];
                    if (!byLevel[weight]) byLevel[weight] = [];
                    byLevel[weight].push(name);
                }
                // reverse levels (first level is a root and should be mapped at the end of all listeners
                const keys = Object.keys(byLevel).map(key => parseInt(key)); // get keys as integers
                keys.sort((a, b) => b - a); // sort as numbers (9..0)
                // init map of the ordered listeners
                _orderedListeners[event] = [];
                for (const one of keys) {
                    const handlers = byLevel[one];
                    for (const ns of handlers) {
                        const listener = _byEvent[event][ns].listener;
                        _orderedListeners[event].push(listener);
                    }
                }
            }

            // MAIN FUNCTIONALITY
            // for (const event of Object.keys(_byEvent)) processOneEvent(event);
            Object.keys(_byEvent).forEach(processOneEvent);
        };

        this.getListenersByEvent = function () {
            return _orderedListeners;
        }
    }
}
