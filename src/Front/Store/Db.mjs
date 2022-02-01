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
    /** @type {TeqFw_Web_Front_Store_Entity_Event_Delayed} */
    const idbEventQueue = spec['TeqFw_Web_Front_Store_Entity_Event_Delayed$'];

    // ENCLOSED VARS
    const E_EVT_QUE = idbEventQueue.getEntityName();
    const A_EVT_QUE = idbEventQueue.getAttributes();
    const I_EVT_QUE = idbEventQueue.getIndexes();

    // INNER FUNCTIONS
    /**
     * Factory to pin 'db' in the scope and create function to upgrade DB structure on opening.
     * @param {IDBDatabase} db
     * @return {(function(*): void)|*}
     */
    function fnUpgradeDb(db) {
        const autoIncrement = true;
        const multiEntry = true;
        const unique = true;

        // /event/queue
        if (!db.objectStoreNames.contains(E_EVT_QUE)) {
            const store = db.createObjectStore(E_EVT_QUE, {keyPath: A_EVT_QUE.UUID});
            store.createIndex(I_EVT_QUE.BY_DATE, A_EVT_QUE.DATE);
        }
    }

    // MAIN FUNCTIONALITY
    idb.init(NS, IDB_VERSION, fnUpgradeDb);

    return idb;
}
