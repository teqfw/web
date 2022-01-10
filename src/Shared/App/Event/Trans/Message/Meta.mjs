/**
 * Message meta-data for transborder events.
 *
 * @namespace TeqFw_Web_Shared_App_Event_Trans_Message_Meta
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Shared_App_Event_Trans_Message_Meta';

// MODULE'S CLASSES
/**
 * @extends TeqFw_Core_Shared_App_Event_Message_Meta.Dto
 * @memberOf TeqFw_Web_Shared_App_Event_Trans_Message_Meta
 */
class Dto {
    static namespace = `${NS}.Dto`;
    /** @type {string} */
    backUUID;
    /** @type {string} */
    frontUUID;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_IDto
 */
export default class TeqFw_Web_Shared_App_Event_Trans_Message_Meta {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_App_Event_Message_Meta} */
        const baseDto = spec['TeqFw_Core_Shared_App_Event_Message_Meta$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} data
         * @return {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}
         */
        this.createDto = function (data) {
            // init base DTO and copy it to this DTO
            const base = baseDto.createDto(data);
            const res = Object.assign(new Dto(), base);
            // then init this DTO props
            res.backUUID = castString(data?.backUUID);
            res.frontUUID = castString(data?.frontUUID);
            return res;
        }
    }
}
