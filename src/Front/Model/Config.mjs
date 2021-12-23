/**
 * Model object for frontend configuration.
 */
export default class TeqFw_Web_Front_Model_Config {
    /** @type {TeqFw_Web_Front_Defaults} */
    #DEF;
    /** @type {TeqFw_Web_Front_Api_Dto_Config} */
    #frontCfg;
    /** @type {TeqFw_Web_Shared_WAPI_Load_Config.Factory} */
    #route;

    constructor(spec) {
        this.#DEF = spec['TeqFw_Web_Front_Defaults$'];
        this.#frontCfg = spec['TeqFw_Web_Front_Api_Dto_Config$'];
        this.#route = spec['TeqFw_Web_Shared_WAPI_Load_Config#Factory$'];
    }

    /**
     * Load '/web' node of the local configuration from the server and create configuration DTO for front.
     * Place configuration DTO into DI container.
     *
     * @param door
     * @return {Promise<void>}
     */
    async init({door}) {
        const space = this.#DEF.SHARED.SPACE_API;
        const pkg = this.#DEF.SHARED.NAME;
        const service = this.#DEF.SHARED.WEB_LOAD_CONFIG;
        const url = `./${space}/${pkg}${service}`;
        const res = await fetch(url);
        const json = await res.json();
        json.data.door = door;
        // place loaded values into singleton from DI container
        Object.assign(this.#frontCfg, json.data);
    }
}
