/**
 * Wrapper to IDBDatabase to use in TeqFW.
 */
export default class TeqFw_Web_Front_App_Store_IDB {
    constructor() {

        // VARS
        /** @type {IDBDatabase} */
        let _db;
        /** @type {function: function} */
        let _fnDbUpgrade;
        /** @type {number} */
        let _dbVersion;
        /** @type {string} */
        let _dbName;

        // FUNCS
        /**
         * Return index if 'index' is available for given 'store' or store itself.
         * @param {IDBObjectStore} store
         * @param {string} index
         * @return {IDBObjectStore|IDBIndex}
         */
        function _getSource(store, index) {
            const hasIndex = store.indexNames.contains(index);
            return (hasIndex) ? store.index(index) : store;
        }

        // INSTANCE METHODS

        /**
         * Drop current database.
         * @return {Promise<void>}
         */
        this.dropDb = async () => {
            if (_db) _db.close();

            const promise = new Promise(function (resolve, reject) {
                // VARS
                let idRepeat, i = 0;

                // FUNCS
                function drop() {
                    /** @type {IDBOpenDBRequest} */
                    const req = indexedDB.deleteDatabase(_dbName);
                    req.onblocked = () => {
                        if (i++ > 10) {
                            console.log(`Cannot drop IDB '${_dbName}'.`);
                            console.dir(req);
                            reject(req);
                            clearInterval(idRepeat);
                        }
                    }
                    req.onsuccess = () => {
                        clearInterval(idRepeat);
                        resolve();
                    };
                    req.onerror = () => {
                        clearInterval(idRepeat);
                        reject();
                    }
                }

                // MAIN
                idRepeat = setInterval(drop, 100);
            });
            await promise;
            _db = undefined;
        }

        this.init = function (name, version, fnUpgrade) {
            _dbName = name;
            _dbVersion = version;
            _fnDbUpgrade = fnUpgrade;
        }
        this.open = async () => {

            // FUNCS
            function createPromise(name, version, fnUpgrade) {
                return new Promise(function (resolve, reject) {
                    /** @type {IDBOpenDBRequest} */
                    const req = indexedDB.open(name, version);
                    req.onupgradeneeded = () => {
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

            // MAIN
            if (typeof _fnDbUpgrade !== 'function') throw new Error(`Please set DB upgrade function with 'setDbUpgradeFn()' before opening.`);
            if (_db === undefined) {
                const promise = createPromise(_dbName, _dbVersion, _fnDbUpgrade);
                const resDb = await promise;
                resDb.onclose = () => {
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
                    const name = one.getName();
                    stores.push(name);
                }
            } else {
                const name = meta.getName();
                stores.push(name);
            }
            const mode = (readwrite) ? 'readwrite' : 'readonly';
            return _db.transaction(stores, mode);
        }

        /**
         * Clear storage.
         *
         * @param {IDBTransaction} trx
         * @param {TeqFw_Web_Front_Api_Store_IEntity} meta
         * @returns {Promise<void>}
         */
        this.clear = async function (trx, meta) {
            const storeName = meta.getName();
            const store = trx.objectStore(storeName);
            return await new Promise((resolve, reject) => {
                const req = store.clear();
                req.onerror = () => reject(req.error);
                req.onsuccess = () => resolve(req.result);
            });
        }

        /**
         * @param {IDBTransaction} trx
         * @param {TeqFw_Web_Front_Api_Store_IEntity} meta
         * @param {*} data
         */
        this.create = async function (trx, meta, data) {
            // FUNCS
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

            // MAIN
            const storeName = meta.getName();
            const store = trx.objectStore(storeName);
            // remove primary key attributes if undefined (to use autoincrement)
            const pk = meta.getPrimaryKey();
            for (const one of pk)
                if (data[one] === undefined) delete data[one];
            // create promise and perform operation
            return await createPromise(store, data);
        }
        /**
         * @param {IDBTransaction} trx
         * @param {TeqFw_Web_Front_Api_Store_IEntity} meta
         * @param {IDBValidKey|IDBKeyRange} key JS primitive for simple PK or object/array for complex PK or unique key
         * @return {*}
         */
        this.deleteOne = async function (trx, meta, key) {
            let res = null;
            if (key) { // key must be valid object or primitive
                const storeName = meta.getName();
                const store = trx.objectStore(storeName);
                const promise = new Promise((resolve, reject) => {
                    // TODO: test it for multi-key (more than 1 attr in the key)
                    const norm = typeof key === 'object' ? Object.values(key) : key;
                    const req = store.delete(norm);
                    req.onerror = () => reject(req.error);
                    req.onsuccess = () => resolve(req.result);
                });
                res = await promise;
            }
            return res;
        }

        /**
         * @param {IDBTransaction} trx
         * @param {TeqFw_Web_Front_Api_Store_IEntity} meta
         * @param {IDBValidKey} key JS primitive for simple PK or object/array for complex PK or unique key
         * @param {string} [indexName] index name to use in lookup
         * @return {*}
         */
        this.readOne = async function (trx, meta, key, indexName) {
            // FUNCS

            // MAIN
            let res = null;
            if (key) { // key must be valid object or primitive
                const storeName = meta.getName();
                const store = trx.objectStore(storeName);
                let source = (indexName) ? store.index(indexName) : store;
                const promise = new Promise((resolve, reject) => {
                    const norm = typeof key === 'object' ? Object.values(key) : key;
                    const req = source.get(norm);
                    req.onerror = () => reject(req.error);
                    req.onsuccess = () => resolve(req.result);
                });
                const data = await promise;
                if (data) res = meta.createDto(data);
            }
            return res;
        }

        /**
         * @param {IDBTransaction} trx
         * @param {TeqFw_Web_Front_Api_Store_IEntity} meta
         * @param {string} indexName
         * @param {IDBKeyRange} query
         * @param {number} count
         * @return {Promise<*[]>}
         */
        this.readSet = async function (trx, meta, indexName = null, query = null, count = null) {
            const res = [];
            const storeName = meta.getName();
            const store = trx.objectStore(storeName);
            const promise = new Promise((resolve, reject) => {
                const source = (
                    indexName && Object.values(meta.getIndexes()).includes(indexName)
                ) ? store.index(indexName) : store;
                const req = source.getAll(query, count);
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

        /**
         * Read values from index or primary key.
         * @param {IDBTransaction} trx
         * @param {TeqFw_Web_Front_Api_Store_IEntity} meta
         * @param {string} [index]
         * @param {IDBKeyRange} [query]
         * @param {boolean} [backward]
         * @param {number} [limit]
         * @return {Promise<*[]>}
         */
        this.readKeys = async function (trx, meta, {index, query, backward, limit} = {}) {

            const res = [];
            const storeName = meta.getName();
            const store = trx.objectStore(storeName);
            const source = _getSource(store, index);
            // perform async activity synchronously
            await new Promise((resolve, reject) => {
                const dir = (backward) ? 'prev' : 'next';
                const req = source.openKeyCursor(query, dir);
                let count = 0;
                /** @type {string[]} */
                const keyAttrs = meta.getKeysForIndex(index);
                req.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        if ((limit === undefined) || (count++ < limit)) {
                            const key = {};
                            if (keyAttrs.length === 1) {
                                key[keyAttrs] = cursor.key;
                            } else {
                                let i = 0;
                                for (const name of keyAttrs) key[name] = cursor.key[i++];
                            }
                            res.push(key);
                            cursor.continue();
                        } else resolve();
                    } else resolve();
                };
                req.onerror = reject;
            });
            if (backward) res.reverse();
            return res;
        }

        /**
         * Update one object in the store.
         * @param {IDBTransaction} trx
         * @param {TeqFw_Web_Front_Api_Store_IEntity} meta
         * @param dto
         * @return {Promise<*>}
         */
        this.updateOne = async function (trx, meta, dto) {
            const storeName = meta.getName();
            const store = trx.objectStore(storeName);
            const promise = new Promise((resolve, reject) => {
                const req = store.put(dto);
                req.onerror = () => reject(req.error);
                req.onsuccess = () => resolve(req.result);
            });
            return await promise;
        }
    }
}
