/**
 * Model to store and propagate across the application front-to-back connection state.
 * @interface
 */
export default class TeqFw_Web_Front_Api_Mod_Server_IConnect {

    /**
     * Some connector (WAPI or Events Direct Channel) starts outgoing transfer.
     */
    startActivity() {}

    /**
     * Some connector (WAPI or Events Direct Channel) stops outgoing transfer.
     */
    stopActivity() {}

    /**
     * Front or back is disconnected.
     */
    setOffline() {}

    /**
     * Events Reverse Channel is up and working.
     */
    setOnline() {}
}
