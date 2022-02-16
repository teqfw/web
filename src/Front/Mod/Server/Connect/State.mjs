/**
 * Default implementation for connect state model.
 *
 * @implements TeqFw_Web_Front_Api_Mod_Server_Connect_IState
 */
export default class TeqFw_Web_Front_Mod_Server_Connect_State {
    constructor() {

        // ENCLOSED VARS
        let _online = false;

        // INSTANCE METHODS

        this.isOnline = () => _online;
        this.startActivity = () => {};
        this.stopActivity = () => {};
        this.setOffline = () => _online = false;
        this.setOnline = () => _online = true;
    }

}
