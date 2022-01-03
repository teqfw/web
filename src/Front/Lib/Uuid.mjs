/**
 * Wrapper for 'uuid' functions.
 *
 * @namespace TeqFw_Web_Front_Lib_Uuid
 */
// MODULE'S IMPORT
// these frontend imports are related to 'https://.../src/@teqfw/web/Front/Lib/Uuid.mjs'
import asV4 from '../../../../uuid/v4.js';
import asValidate from '../../../../uuid/validate.js';


// MODULE'S VARS
// these intermediary variables are used to set JSDocs comments to export.
/** @memberOf TeqFw_Web_Front_Lib_Uuid */
const v4 = asV4;
/** @memberOf TeqFw_Web_Front_Lib_Uuid */
const validate = asValidate;

export {
    v4,
    validate,
}
