/**
 * Model to store and propagate across the application front-to-back connection state.
 * @interface
 */
export default class TeqFw_Web_Front_Api_Mod_Server_Connect_IState {
    /**
     * 'true' - if connection with server is established and works.
     * @return {boolean}
     */
    isOnline() {}

    /**
     * Some connector (WAPI or Events Direct Channel) starts outgoing transfer.
     */
    startActivity() {}

    /**
     * Some connector (WAPI or Events Direct Channel) stops outgoing transfer.
     */
    stopActivity() {}

    /**
     * Auth or back is disconnected.
     */
    setOffline() {}

    /**
     * Events Stream Channel is up and working.
     */
    setOnline() {}
}
