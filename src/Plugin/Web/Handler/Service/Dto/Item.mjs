/**
 * DTO to store data about service in API service handler.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Plugin_Web_Handler_Service_Dto_Item';

// MODULE'S CLASSES
class TeqFw_Web_Plugin_Web_Handler_Service_Dto_Item {
    /** @type {TeqFw_Web_Back_Api_Service_Factory_IReqRes} */
    dtoFactory;
    /** @type {function(TeqFw_Web_Back_Api_Service_IContext): Promise<void>} */
    service;
}

/**
 * Factory to create new DTO instances.
 * @memberOf TeqFw_Web_Plugin_Web_Handler_Service_Dto_Item
 */
class Factory {
    constructor() {
        /**
         * @param {TeqFw_Web_Plugin_Web_Handler_Service_Dto_Item|null} data
         * @return {TeqFw_Web_Plugin_Web_Handler_Service_Dto_Item}
         */
        this.create = function (data = null) {
            return new TeqFw_Web_Plugin_Web_Handler_Service_Dto_Item();
        }
    }
}

// freeze class to deny attributes changes then export class
Object.freeze(TeqFw_Web_Plugin_Web_Handler_Service_Dto_Item);
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
export {
    TeqFw_Web_Plugin_Web_Handler_Service_Dto_Item as default,
    Factory
} ;
