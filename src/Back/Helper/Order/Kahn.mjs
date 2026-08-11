// @ts-check

/**
 * @namespace TeqFw_Web_Back_Helper_Order_Kahn
 * @description Sorts named handlers by relative `before` / `after` constraints using Kahn's algorithm.
 */
export default class Kahn {
    /**
     * Creates the handler ordering helper.
     */
    constructor() {
        /**
         * Topologically sorts handlers with `name`, `before`, `after` fields.
         *
         * @param {TeqFw_Web_Back_Api_Handler[]} handlers - Handlers to sort.
         * @returns {TeqFw_Web_Back_Api_Handler[]} - Sorted list.
         * @throws {Error} - If circular dependency is detected.
         */
        this.sort = function (handlers) {
            const nameToHandler = new Map();
            const graph = new Map(); // name => Set of downstream nodes
            const inDegree = new Map(); // name => number of incoming edges

            // Initialize maps
            for (const h of handlers) {
                const info = h.getRegistrationInfo();
                const name = info.name;
                nameToHandler.set(name, h);
                graph.set(name, new Set());
                inDegree.set(name, 0);
            }

            // Build graph
            for (const h of handlers) {
                const {name, after = [], before = []} = h.getRegistrationInfo();

                for (const dep of after) {
                    if (!graph.has(dep)) continue;
                    graph.get(dep).add(name);
                    inDegree.set(name, inDegree.get(name) + 1);
                }

                for (const dep of before) {
                    if (!graph.has(dep)) continue;
                    graph.get(name).add(dep);
                    inDegree.set(dep, inDegree.get(dep) + 1);
                }
            }

            // Kahn's algorithm
            const queue = [];
            for (const [name, count] of inDegree.entries()) {
                if (count === 0) queue.push(name);
            }

            const sorted = [];
            while (queue.length > 0) {
                const name = queue.shift();
                sorted.push(nameToHandler.get(name));
                for (const neighbor of graph.get(name)) {
                    inDegree.set(neighbor, inDegree.get(neighbor) - 1);
                    if (inDegree.get(neighbor) === 0) queue.push(neighbor);
                }
            }

            if (sorted.length !== handlers.length) {
                throw new Error('Circular dependency detected among handlers');
            }

            return sorted;
        };
    }
}
