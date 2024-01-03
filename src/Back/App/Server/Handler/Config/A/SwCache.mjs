/**
 * Action to load files to be cached on the front by service worker.
 *
 * @namespace TeqFw_Web_Back_App_Server_Handler_Config_A_SwCache
 */
// MODULE'S IMPORT
import {join} from 'node:path';
import {createWriteStream, existsSync} from 'node:fs';
import archiver from 'archiver';

// MODULE'S VARS
const NS = 'TeqFw_Web_Back_App_Server_Handler_Config_A_SwCache';

// MODULE'S FUNCS
/**
 * Default export is a factory to create result function in working environment (with deps).
 *
 * @param {TeqFw_Web_Back_Defaults} DEF
 * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
 * @param {TeqFw_Core_Back_Config} config
 * @param {TeqFw_Core_Back_Util.scanRecursively|function} scanRecursively
 * @param {TeqFw_Core_Back_Api_Plugin_Registry} registry
 */
export default function (
    {
        TeqFw_Web_Back_Defaults$: DEF,
        TeqFw_Core_Shared_Api_Logger$$: logger,
        TeqFw_Core_Back_Config$: config,
        ['TeqFw_Core_Back_Util#scanRecursively']: scanRecursively,
        TeqFw_Core_Back_Api_Plugin_Registry$: registry,
    }
) {
    // VARS
    const ZIP = join(config.getPathToRoot(), DEF.SHARED.FILE_SW_CACHE_ZIP);

    // FUNCS

    /**
     * Result function.
     * @memberOf TeqFw_Web_Back_App_Server_Handler_Config_A_SwCache
     * @return {Promise<*[]>}
     */
    async function act() {
        // FUNCS

        /**
         * Initialize the archiver to create ZIP file.
         * @return {Archiver}
         */
        function openArchive() {
            const archive = archiver('zip', {zlib: {level: 9}});
            archive.on('error', (err) => {
                throw err;
            });
            // Pipe archive data to the file
            logger.info(`Create archive: ${ZIP}`);
            const output = createWriteStream(ZIP);
            output.on('close', () => {
                logger.info(`Archive size: ${archive.pointer()} bytes.`);
            });
            archive.pipe(output);
            return archive;
        }

        /**
         * Scan sources root recursively for files to cache and replace filesystem parts with URL parts.
         *
         * @param {Archiver} zip
         * @param {string} root path to the root folder of sources
         * @param {string} pluginName '@vnd/plugin'
         * @return {string[]}
         */
        function readSrcFiles(zip, root, pluginName) {
            const res = [];
            const SPACE_SRC = DEF.SHARED.SPACE_SRC;
            // scan './Front/'
            const pathFront = join(root, DEF.SHARED.DIR_SRC_FRONT);
            if (existsSync(pathFront)) {
                const files = scanRecursively(pathFront);
                const urls = files.map(entry => entry.replace(root, `./${SPACE_SRC}/${pluginName}`));
                for (let i = 0; i < files.length; i++) zip.file(files[i], {name: urls[i]});
                res.push(...urls);
            }
            // scan './Shared/'
            const pathShared = join(root, DEF.SHARED.DIR_SRC_FRONT);
            if (existsSync(pathShared)) {
                const files = scanRecursively(pathShared);
                const urls = files.map(entry => entry.replace(root, `./${SPACE_SRC}/${pluginName}`));
                for (let i = 0; i < files.length; i++) zip.file(files[i], {name: urls[i]});
                res.push(...urls);
            }
            return res;
        }

        /**
         * Scan app web root recursively and replace filesystem parts with URL parts.
         *
         * @param {Archiver} zip
         * @param {string} path path to the root folder of web resources
         * @param {string[]} excl paths to exclude from scan
         * @return {string[]}
         */
        function readWebRoot(zip, path, excl) {
            const res = [];
            if (existsSync(path)) {
                // scan all files
                let files = scanRecursively(path);
                // exclude some files from results
                for (const one of excl) {
                    const full = join(path, one);
                    files = files.filter((entry) => entry.indexOf(full) !== 0);
                }
                // convert paths to URLs
                const urls = files.map(entry => entry.replace(path, '.'));
                for (let i = 0; i < files.length; i++) zip.file(files[i], {name: urls[i]});
                res.push(...urls);
                res.push('.'); // add root default URL
            }
            return res;
        }

        /**
         * Scan plugin web root recursively and replace filesystem parts with URL parts.
         *
         * @param {Archiver} zip
         * @param {string} path path to the root folder of web resources
         * @param {string} pluginName '@vnd/plugin'
         * @return {string[]}
         */
        function readWebPlugin(zip, path, pluginName) {
            const res = [];
            const SPACE_WEB = DEF.SHARED.SPACE_WEB;
            if (existsSync(path)) {
                const files = scanRecursively(path);
                const urls = files.map(entry => entry.replace(path, `./${SPACE_WEB}/${pluginName}`));
                for (let i = 0; i < files.length; i++) zip.file(files[i], {name: urls[i]});
                res.push(...urls);
            }
            return res;
        }

        // MAIN
        const res = [];
        const zip = openArchive();
        const appName = registry.getAppName();
        const plugins = registry.items();
        for (const plugin of plugins) {
            /** @type {TeqFw_Core_Back_Plugin_Dto_Desc_Di.Dto} */
            const desc = plugin.teqfw[DEF.MOD_CORE.SHARED.NAME_DI];
            const autoload = desc.autoload;
            // read all files from `./Front/` & `./Shared/` folders of the plugin's `./src/`
            const src = join(plugin.path, autoload.path);
            res.push(...readSrcFiles(zip, src, plugin.name));
            // read all files from the `./web/` folder of the plugin
            if (plugin.name === appName) {
                // app root plugin
                /** @type {TeqFw_Web_Back_Plugin_Dto_Desc.Dto} */
                const desc = plugin.teqfw[DEF.SHARED.NAME];
                const doors = desc?.doors;
                if (Array.isArray(doors)) {
                    // TODO: process with 'doors'
                    for (const door of doors) {
                        // scan FS for every 'door'
                        // const web = join(item.path, DEF.FS_STATIC_ROOT, door);
                        // res.push(...readAppWeb(web, door));
                    }
                } else {
                    const excl = desc?.excludes?.swCache ?? [];
                    const web = join(plugin.path, DEF.FS_STATIC_ROOT);
                    res.push(...readWebRoot(zip, web, excl));
                }
            } else {
                // regular plugin
                const web = join(plugin.path, DEF.FS_STATIC_ROOT);
                res.push(...readWebPlugin(zip, web, plugin.name));
            }
        }
        logger.info(`Total '${res.length}' files are collected to cache by service worker.`);

        // Finalize the archive (write the footer)
        await zip.finalize();
        return res;
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
