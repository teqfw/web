export default class TeqFw_Web_Back_Handler_Upload {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Back_Defaults$'];

        // DEFINE WORKING VARS / PROPS
        // DEFINE INNER FUNCTIONS
        // DEFINE INSTANCE METHODS

        this.getListener = function (event) {
            return function uploadRequestListener() {
                console.log(`Upload is here...`);
            }
        }
    }
}
