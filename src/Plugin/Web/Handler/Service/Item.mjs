/**
 * Model to store data about service item in API service handler.
 */
// MODULE'S IMPORT
import {pathToRegexp} from 'path-to-regexp';

// MODULE'S CLASSES
export default class TeqFw_Web_Plugin_Web_Handler_Service_Item {
    /**
     * Parameters names for the route ('/post/:postId/comment/:commentId' => ['postId', 'commentId'])
     * @type {string[]}
     */
    params = [];
    /**
     * Regular expression for the service route to check request path against it.
     * @type {RegExp}
     */
    regexp;
    /**
     * Route value ('/post/:postId/comment/:commentId').
     * @type {string}
     */
    route;
    /** @type {TeqFw_Web_Back_Api_Service_Factory_IRoute} */
    routeFactory;
    /** @type {function(TeqFw_Web_Back_Api_Service_IContext): Promise<void>} */
    service;

    /**
     * Initialize item properties using service factory.
     *
     * @param {TeqFw_Web_Back_Api_Service_IFactory} factory
     */
    constructor(factory) {
        this.routeFactory = factory.getRouteFactory();
        this.service = factory.getService();
        this.route = this.routeFactory.getRoute();
        const params = [];
        this.regexp = pathToRegexp(this.routeFactory.getRoute(), params);
        params.map((one) => this.params.push(one.name));
    }

}

