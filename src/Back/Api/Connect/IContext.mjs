/**
 * Objects related to one web connection (HTTP request or stream).
 * @namespace TeqFw_Web_Back_Api_Connect_IContext
 * @interface
 */
export default class TeqFw_Web_Back_Api_Connect_IContext {
    /**
     * Get stream related to the connection.
     * @return {stream.Duplex}
     */
    getStream() {}
}
