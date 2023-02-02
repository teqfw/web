/**
 * DTO for DI container configuration (namespaces and replacements).
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_Dto_Config_Di';

// MODULE'S CLASSES
/**
 * @memberOf TeqFw_Web_Shared_Dto_Config_Di
 */
class Dto {
    static namespace = NS;
    /** @type {TeqFw_Web_Shared_Dto_Config_Di_Namespace.Dto[]} */
    namespaces;
    /** @type {TeqFw_Web_Shared_Dto_Config_Di_Replacement.Dto[]} */
    replacements;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class TeqFw_Web_Shared_Dto_Config_Di {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castArrayOfObj|function} */
        const castArrayOfObj = spec['TeqFw_Core_Shared_Util_Cast.castArrayOfObj'];
        /** @type {TeqFw_Web_Shared_Dto_Config_Di_Namespace} */
        const dtoNs = spec['TeqFw_Web_Shared_Dto_Config_Di_Namespace$'];
        /** @type {TeqFw_Web_Shared_Dto_Config_Di_Replacement} */
        const dtoReplace = spec['TeqFw_Web_Shared_Dto_Config_Di_Replacement$'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Shared_Dto_Config_Di.Dto} [data]
         * @return {TeqFw_Web_Shared_Dto_Config_Di.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.namespaces = castArrayOfObj(data?.namespaces, dtoNs.createDto);
            res.replacements = castArrayOfObj(data?.replacements, dtoReplace.createDto);
            return res;
        }

    }

}
