/**
 * Auth app interface is used by bootstrap loader (see `@teqfw/web/web/js/loader.mjs`).
 *
 *
 * @interface
 */
export default class TeqFw_Web_Front_Api_IApp {

    /**
     * Create front app and initialize it.
     * @param {function(string)} fn printout function to display/log initialization messages
     * @returns {Promise<boolean>}
     */
    async init(fn) {}

    /**
     * Mount front app to launchpad.
     * @param {string} cssSelector
     */
    mount(cssSelector) {}

    /**
     * Mount reinstall app to launchpad.
     * @param {string} cssSelector
     */
    reinstall(cssSelector) {}
}
