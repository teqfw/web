/**
 * Wrapper for 'tweetnacl' npm-package (commonJS).
 *
 * Statics mapping for web server see in './teqfw.json'.
 * All frontend imports are related to this es6-module.
 *
 * @namespace TeqFw_Web_Front_Lib_Nacl
 */
// MODULE'S IMPORT
import * as unused from '../../../../tweetnacl/nacl-fast.min.js'; // just load CommonJS module to browser

// MODULE'S MAIN
// re-export imported stuff from 'window' object
export const {
    box,
    randomBytes,
    secretbox,
} = window.nacl;
