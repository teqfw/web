// @ts-check

/**
 * @namespace TeqFw_Web_Back_Handler_Static_A_FileService
 * @description Static file service.
 */
export default class FileService {
    /**
     * @param {object} deps
     * @param {typeof import("node:fs")} deps.fs
     * @param {typeof import("node:http2")} deps.http2
     * @param {typeof import("node:path")} deps.path
     * @param {TeqFw_Log_Provider} deps.logger
     * @param {TeqFw_Web_Back_Helper_Mime} deps.helpMime
     * @param {TeqFw_Web_Back_Handler_Static_A_Resolver} deps.resolver
     * @param {TeqFw_Web_Back_Handler_Static_A_Fallback} deps.fallback
     */
    constructor({fs, http2, path, logger, helpMime, resolver, fallback}) {
        const {constants: H2} = http2;
        const log = logger.forSource('TeqFw_Web_Back_Handler_Static_A_FileService');

        /**
         * Serve a file for given config and relative path.
         *
         * @param {TeqFw_Web_Back_Handler_Static_A_Config__Value} config
         * @param {string} rel
         * @param {TeqFw_Web_Back_Request_Target} req
         * @param {TeqFw_Web_Back_Response_Target} res
         * @returns {Promise<boolean>} true if served
         */
        this.serve = async (config, rel, req, res) => {
            let fsPath;
            try {
                fsPath = resolver.resolve(config, rel);
                if (!fsPath) return false;

                fsPath = await fallback.apply(fsPath, config.defaults);
                if (!fsPath) return false;

                const stat = await fs.promises.stat(fsPath);
                if (!stat.isFile()) return false;

                const stream = fs.createReadStream(fsPath);
                const ext = path.extname(fsPath).toLowerCase();
                const headers = {
                    [H2.HTTP2_HEADER_CONTENT_LENGTH]: stat.size,
                    [H2.HTTP2_HEADER_CONTENT_TYPE]: helpMime.getByExt(ext),
                    [H2.HTTP2_HEADER_LAST_MODIFIED]: stat.mtime.toUTCString(),
                };
                /** @type {TeqFw_Web_Back_Response_Target & {writeHead(status: number, headers?: Record<string, string|number>): void}} */
                const target = /** @type {*} */ (res);
                target.writeHead(H2.HTTP_STATUS_OK, headers);
                stream.pipe(res);
                return true;
            } catch (e) {
                /** @type {{code?: string}} */
                const err = /** @type {*} */ (e);
                if (err.code === 'ENOENT') {
                    log.info(`File not found: ${fsPath}`);
                } else if (err.code === 'EACCES' || err.code === 'EPERM') {
                    log.warn(`Access denied: ${fsPath}`);
                } else {
                    log.error('Static file service failed', {
                        err: e,
                        path: fsPath,
                        requestUrl: req?.url,
                    });
                }
                return false;
            }
        };
    }
}

/**
 * Dependencies for the static file service.
 */
export const __deps__ = Object.freeze({
    default: {
        fs: 'node:fs',
        http2: 'node:http2',
        path: 'node:path',
        logger: 'TeqFw_Log_Provider$',
        helpMime: 'TeqFw_Web_Back_Helper_Mime$',
        resolver: 'TeqFw_Web_Back_Handler_Static_A_Resolver$',
        fallback: 'TeqFw_Web_Back_Handler_Static_A_Fallback$',
    },
});
