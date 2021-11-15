/**
 * Wrapper to IDBDatabase to use in TeqFW.
 */
export default class TeqFw_Web_Front_Store_IDB {
    constructor(spec) {

        // DEFINE WORKING VARS / PROPS
        /** @type {IDBDatabase} */
        let _db;
        /** @type {function: function} */
        let dbFnDbUpgrade;
        /** @type {number} */
        let dbVersion;
        /** @type {string} */
        let dbName;

        // DEFINE INNER FUNCTIONS


        // DEFINE INSTANCE METHODS

        /**
         * Drop current database.
         * @return {Promise<void>}
         */
        this.dropDb = async () => {
            if (_db) _db.close();
            const promise = new Promise(function (resolve, reject) {
                /** @type {IDBOpenDBRequest} */
                const req = indexedDB.deleteDatabase(dbName);
                req.onblocked = () => {
                    console.log('IDB delete error:' + req);
                    reject(req);
                }
                req.onsuccess = resolve;
                req.onerror = reject;
            });
            await promise;
            _db = undefined;
        }

        this.init = function (name, version, fnUpgrade) {
            dbName = name;
            dbVersion = version;
            dbFnDbUpgrade = fnUpgrade;
        }
        this.open = async () => {

            // DEFINE INNER FUNCTIONS
            function createPromise(name, version, fnUpgrade) {
                return new Promise(function (resolve, reject) {
                    /** @type {IDBOpenDBRequest} */
                    const req = indexedDB.open(name, version);
                    req.onupgradeneeded = (event) => {
                        fnUpgrade(req.result);
                    };
                    req.onsuccess = () => {
                        _db = req.result;
                        resolve(_db);
                    };
                    req.onerror = function () {
                        console.log('IDB open error:' + req.error);
                        reject(req.error);
                    };
                });
            }

            // MAIN FUNCTIONALITY
            if (typeof dbFnDbUpgrade !== 'function') throw new Error(`Please set DB upgrade function with 'setDbUpgradeFn()' before opening.`);
            if (_db === undefined) {
                const promise = createPromise(dbName, dbVersion, dbFnDbUpgrade);
                const resDb = await promise;
                resDb.onclose = (event) => {
                    _db = undefined;
                };
            }
        }
        /**
         * @param {TeqFw_Web_Front_Api_Store_IEntity[], TeqFw_Web_Front_Api_Store_IEntity} meta
         * @param {boolean} readwrite
         * @return {Promise<IDBTransaction>}
         */
        this.startTransaction = async (meta, readwrite = true) => {
            if (_db === undefined) await this.open();
            const stores = [];
            if (Array.isArray(meta)) {
                for (const one of meta) {
                    const name = one.getEntityName();
                    stores.push(name);
                }
            } else {
                const name = meta.getEntityName();
                stores.push(name);
            }
            const mode = (readwrite) ? 'readwrite' : 'readonly';
            return _db.transaction(stores, mode);
        }

        /**
         * TODO: should be a CRUD notation (create)
         * @param {IDBTransaction} trx
         * @param {TeqFw_Web_Front_Api_Store_IEntity} meta
         * @param {*} data
         */
        this.add = async function (trx, meta, data) {
            // DEFINE INNER FUNCTIONS
            function createPromise(store, data) {
                return new Promise(function (resolve, reject) {
                    const req = store.add(data);
                    req.onerror = function () {
                        console.log('IDB Store error:' + req.error);
                        reject(req.error);
                    }
                    req.onsuccess = function () {
                        resolve(req.result);
                    }
                });
            }

            // MAIN FUNCTIONALITY
            const storeName = meta.getEntityName();
            const store = trx.objectStore(storeName);
            // remove primary key attributes if undefined (to use autoincrement)
            const pk = meta.getPrimaryKey();
            for (const one of pk)
                if (data[one] === undefined) delete data[one];
            // create promise and perform operation
            const res = await createPromise(store, data);
            return res;
        }

        /**
         * @param {IDBTransaction} trx
         * @param {TeqFw_Web_Front_Api_Store_IEntity} meta
         * @param {IDBValidKey} key JS primitive for simple PK or object/array for complex PK or unique key
         * @return {*}
         */
        this.readOne = async function (trx, meta, key) {
            // DEFINE INNER FUNCTIONS

            // MAIN FUNCTIONALITY
            let res = null;
            if (key) { // key must be valid object or primitive
                const storeName = meta.getEntityName();
                const store = trx.objectStore(storeName);
                const promise = new Promise((resolve, reject) => {
                    const req = store.get(key);
                    req.onerror = () => reject(req.error);
                    req.onsuccess = () => resolve(req.result);
                });
                const data = await promise;
                if (data) res = meta.createDto(data);
            }
            return res;
        }

        this.readSet = async function (trx, meta, indexName, query = null, count = null) {
            const res = [];
            const storeName = meta.getEntityName();
            const store = trx.objectStore(storeName);
            const index = store.index(indexName);
            const promise = new Promise((resolve, reject) => {
                const req = index.getAll(query, count);
                req.onerror = () => reject(req.error);
                req.onsuccess = () => resolve(req.result);
            });
            const data = await promise;
            if (Array.isArray(data)) {
                for (const one of data) {
                    const dto = meta.createDto(one);
                    res.push(dto);
                }
            }
            return res;
        }
    }
}
