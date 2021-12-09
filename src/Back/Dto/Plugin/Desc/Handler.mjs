/**
 * DTO to describe web requests handler (events to listen and spaces to control).
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Dto_Plugin_Desc_Handler';

// MODULE'S CLASSES
export default class TeqFw_Web_Back_Dto_Plugin_Desc_Handler {
    /** @type {Object<string, TeqFw_Web_Back_Dto_Plugin_Desc_Handler_Event>} */
    events;
    /**
     * Names of the spaces in URLs that processed by this handler.
     * (@see TeqFw_Web_Back_Dto_Address)
     *
     * @type {string[]}
     */
    spaces;
}

// attributes names to use as aliases in queries to object props
TeqFw_Web_Back_Dto_Plugin_Desc_Handler.EVENTS = 'events';
TeqFw_Web_Back_Dto_Plugin_Desc_Handler.SPACES = 'spaces';

/**
 * Factory to create new DTO instances.
 * @memberOf TeqFw_Web_Back_Dto_Plugin_Desc_Handler
 */
export class Factory {
    constructor(spec) {
        const {castArrayOfStr} = spec['TeqFw_Core_Shared_Util_Cast'];
        /** @type {TeqFw_Web_Back_Dto_Plugin_Desc_Handler_Event.Factory} */
        const fEvent = spec['TeqFw_Web_Back_Dto_Plugin_Desc_Handler_Event.Factory$'];

        /**
         * @param {TeqFw_Web_Back_Dto_Plugin_Desc_Handler|null} data
         * @return {TeqFw_Web_Back_Dto_Plugin_Desc_Handler}
         */
        this.create = function (data = null) {
            // DEFINE INNER FUNCTIONS
            function parseEvents(data) {
                const res = {};
                if (typeof data === 'object')
                    for (const key of Object.keys(data))
                        res[key] = fEvent.create(data[key]);
                return res;
            }

            // MAIN FUNCTIONALITY
            const res = new TeqFw_Web_Back_Dto_Plugin_Desc_Handler();
            res.events = parseEvents(data?.events);
            res.spaces = castArrayOfStr(data?.spaces);
            return res;
        }
    }
}

// finalize code components for this es6-module
Object.freeze(TeqFw_Web_Back_Dto_Plugin_Desc_Handler);
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
