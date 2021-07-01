/**
 * Load configuration to the front.
 *
 * @namespace TeqFw_Web_Back_Service_Load_Config
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';
import $path from 'path';
// MODULE'S VARS
const NS = 'TeqFw_Web_Back_Service_Load_Config';

/**
 * @implements TeqFw_Web_Back_Api_Service_IFactory
 */
export default class TeqFw_Web_Back_Service_Load_Config {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Defaults} */
        const DEF = spec['TeqFw_Web_Defaults$'];
        /** @type {TeqFw_Core_Back_Config} */
        const config = spec['TeqFw_Core_Back_Config$'];
        /** @type {typeof TeqFw_Core_Back_Api_Dto_Plugin_Desc} */
        const DescCore = spec['TeqFw_Core_Back_Api_Dto_Plugin_Desc#'];
        /** @type {TeqFw_Core_Back_Scan_Plugin_Registry} */
        const registry = spec['TeqFw_Core_Back_Scan_Plugin_Registry$'];
        /** @type {TeqFw_Web_Shared_Service_Route_Load_Config.Factory} */
        const fReqRes = spec['TeqFw_Web_Shared_Service_Route_Load_Config#Factory$'];
        /** @type {TeqFw_Web_Shared_Service_Dto_Namespace_Item.Factory} */
        const fItem = spec['TeqFw_Web_Shared_Service_Dto_Namespace_Item#Factory$'];

        // DEFINE WORKING VARS / PROPS

        // DEFINE INNER FUNCTIONS


        // DEFINE INSTANCE METHODS
        this.getDtoFactory = function () {
            return fReqRes;
        }

        this.getRoute = function () {
            return '/load/config';
        }

        this.getService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             *
             * @param {TeqFw_Web_Back_Api_Service_IContext} context
             * @return {Promise<void>}
             */
            async function service(context) {
                /** @type {TeqFw_Web_Shared_Service_Route_Load_Config.Response} */
                const out = context.getOutData();
                // put web part of the local configuration to the out
                const webCfg = config.get()?.local?.web;
                Object.assign(out, webCfg);
            }

            // MAIN FUNCTIONALITY
            Object.defineProperty(service, 'name', {value: `${NS}.${service.name}`});
            return service;
        }
    }

}
