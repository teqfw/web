// @ts-check

/**
 * @namespace TeqFw_Web_Back_Handler_Static_A_Resolver
 * @description Static path resolver.
 */
export default class Resolver {
    /**
     * @param {object} deps
     * @param {typeof import("node:path")} deps.path
     */
    constructor({path}) {
        /**
         * Resolve a filesystem path for given config and relative URL part.
         * Applies allow rules and prevents path traversal.
         *
         * @param {TeqFw_Web_Back_Handler_Static_A_Config__Value} config
         * @param {string} rel
         * @returns {string|null}
         * @throws {Error} On traversal or absolute rel paths.
         */
        this.resolve = (config, rel) => {
            // disallow path‐traversal or absolute rel
            if (rel.includes('..') || path.isAbsolute(rel)) {
                throw new Error('Static access denied');
            }

            let pkgName;
            let subPath = '';

            if (!config.allow) {
                let fsPath = path.resolve(config.root, rel);
                if (/[\\/]$/.test(fsPath) && fsPath.length > 1) {
                    fsPath = fsPath.replace(/[\\/]+$/, '');
                }
                if (!fsPath.startsWith(config.root)) {
                    throw new Error('Resolved path is outside the root');
                }
                return fsPath;
            }

            // root‐level allow: '.' rules permit any rel under root
            if (config.allow?.['.'] != null) {
                pkgName = '.';
                subPath = rel;
            } else if (config.allow) {
                for (const key of Object.keys(config.allow)) {
                    if (rel === key || rel.startsWith(`${key}/`)) {
                        pkgName = key;
                        const offset = key.length + (rel[key.length] === '/' ? 1 : 0);
                        subPath = rel.slice(offset);
                        break;
                    }
                }
            }

            if (!pkgName) {
                return null;
            }

            const rules = config.allow[pkgName] || [];
            let allowed = rules.includes('.');
            if (!allowed) {
                for (const rule of rules) {
                    if (subPath === rule || subPath.startsWith(`${rule}/`)) {
                        allowed = true;
                        break;
                    }
                }
            }
            if (!allowed) {
                return null;
            }

            let fsPath = path.resolve(config.root, rel);
            if (/[\\/]$/.test(fsPath) && fsPath.length > 1) {
                fsPath = fsPath.replace(/[\\/]+$/, '');
            }
            if (!fsPath.startsWith(config.root)) {
                throw new Error('Resolved path is outside the root');
            }

            return fsPath;
        };
    }
}

/**
 * Dependencies for the static resolver helper.
 */
export const __deps__ = Object.freeze({
    default: {
        path: 'node:path',
    },
});
