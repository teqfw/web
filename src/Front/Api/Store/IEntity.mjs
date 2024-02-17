/**
 * Meta information for entities stored in IndexedDB.
 *
 * @interface
 * TODO: rename to `TeqFw_Web_Front_Api_Store_Meta`
 */
export default class TeqFw_Web_Front_Api_Store_IEntity {
    /**
     * Create entity DTO from given data.
     * @param [data]
     * @return {Object}
     */
    createDto(data) {}

    /**
     * Get codifier for entity attributes.
     * @return {*}
     */
    getAttributes() {}

    /**
     * Get entity name: '@vnd/plugin/path/to/entity'.
     * @return {string}
     */
    getName() {}

    /**
     * Get codifier for entity indexes.
     * @return {*}
     */
    getIndexes() {}

    /**
     * Get key attributes names for given index or for primary key if 'index' is omitted.
     * @param {string} [index]
     */
    getKeysForIndex(index) {}

    /**
     * Return array with primary keys for the entity.
     * @return {string[]}
     */
    getPrimaryKey() {}
}
