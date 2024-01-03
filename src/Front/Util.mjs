/**
 * Various frontend utilities.
 *
 * @namespace TeqFw_Web_Front_Util
 */

/**
 * Add style element to the document header. Remove the `style` tags if exist (tags are used for IDEA).
 *
 * @param {string} style
 * @return {boolean} use return value to set `if` flag to prevent double adding
 * @memberof TeqFw_Web_Front_Util
 */
export function addStyle(style) {
    const elStyle = self.document.createElement('style');
    elStyle.textContent = style.replace('<style>', '').replace('</style>', '');
    self.document.head.appendChild(elStyle);
    return true;
}
