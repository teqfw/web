/**
 * Interface for object that displays error for services gateway.
 * @interface
 * @deprecated we should use events here (why???)
 *
 * TODO: this interface is used by other plugins. Should we have a separate interfaces in these plugins?
 *
 */
export default class TeqFw_Web_Front_Api_Gate_IErrorHandler {
    error(e) {}
}
