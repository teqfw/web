/**
 * Meta information for entities stored in IndexedDB.
 *
 * This interface is very close to `TeqFw_Db_Back_RDb_Meta_IEntity`.
 * @interface
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
