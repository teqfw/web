/**
 * IDB for this plugin.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Front_Store_Db';
const IDB_VERSION = 1;
/**
 * Factory to create connector to application level IDB
 * @param spec
 * @return {TeqFw_Web_Front_App_Store_IDB}
 */
export default function (spec) {
    /** @type {TeqFw_Web_Front_App_Store_IDB} */
    const idb = spec['TeqFw_Web_Front_App_Store_IDB$$']; // new instance
    /** @type {TeqFw_Web_Front_Store_Entity_Singleton} */
    const idbSingleton = spec['TeqFw_Web_Front_Store_Entity_Singleton$'];

    // VARS
    const A_SINGLETON = idbSingleton.getAttributes();
    const E_SINGLETON = idbSingleton.getName();

    // INNER FUNCTIONS
    /**
     * Factory to pin 'db' in the scope and create function to upgrade DB structure on opening.
     * @param {IDBDatabase} db
     * @return {(function(*): void)|*}
     */
    function fnUpgradeDb(db) {
        // const autoIncrement = true;
        // const multiEntry = true;
        // const unique = true;

        // /singleton
        if (!db.objectStoreNames.contains(E_SINGLETON)) {
            const store = db.createObjectStore(E_SINGLETON, {keyPath: A_SINGLETON.KEY});
        }
    }

    // MAIN
    idb.init(NS, IDB_VERSION, fnUpgradeDb);

    return idb;
}
