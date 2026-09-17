// @ts-check

/**
 * @namespace TeqFw_Web_Back_Helper_Mime
 * @description MIME type helper with built-in mapping for common file extensions.
 * Consumers may provide additional per-instance mappings through addTypes().
 */

const FALLBACK_TYPE = 'application/octet-stream';
const MIME_TYPE_PATTERN = /^[^\s/;]+\/[^\s/;]+$/;

/**
 * Normalize an extension to the lower-case, leading-dot convention.
 *
 * @param {string} ext
 * @returns {string}
 */
function normalizeExtension(ext) {
    const value = ext.trim().toLowerCase();
    return value.startsWith('.') ? value : `.${value}`;
}

/**
 * Validate and copy custom MIME mappings so callers cannot mutate helper state.
 *
 * @param {*} customTypes
 * @returns {Readonly<Record<string, string>>}
 */
function normalizeCustomTypes(customTypes) {
    if (customTypes === undefined) {
        return Object.freeze({});
    }
    if (typeof customTypes !== 'object' || customTypes === null || Array.isArray(customTypes)) {
        throw new TypeError('customTypes must be a non-null object');
    }

    /** @type {Record<string, string>} */
    const normalized = {};
    for (const [extension, mimeType] of Object.entries(customTypes)) {
        const key = normalizeExtension(extension);
        if (!/^\.[^\s/]+$/.test(key)) {
            throw new TypeError(`Invalid custom MIME extension: ${extension}`);
        }
        if (Object.hasOwn(normalized, key)) {
            throw new TypeError(`Duplicate custom MIME extension: ${extension}`);
        }
        if (typeof mimeType !== 'string' || !MIME_TYPE_PATTERN.test(mimeType)) {
            throw new TypeError(`Invalid custom MIME type for ${extension}`);
        }
        normalized[key] = mimeType;
    }

    return Object.freeze(normalized);
}

/** @type {Readonly<Record<string, string>>} */
const BUILTIN_TYPES = Object.freeze({
    '.aac': 'audio/aac',
    '.abw': 'application/x-abiword',
    '.apng': 'image/apng',
    '.atom': 'application/atom+xml',
    '.avi': 'video/x-msvideo',
    '.avif': 'image/avif',
    '.bmp': 'image/bmp',
    '.bz': 'application/x-bzip',
    '.bz2': 'application/x-bzip2',
    '.css': 'text/css',
    '.csv': 'text/csv',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.eot': 'application/vnd.ms-fontobject',
    '.epub': 'application/epub+zip',
    '.flac': 'audio/flac',
    '.gz': 'application/gzip',
    '.gif': 'image/gif',
    '.htm': 'text/html',
    '.html': 'text/html',
    '.ico': 'image/vnd.microsoft.icon',
    '.ics': 'text/calendar',
    '.jar': 'application/java-archive',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.map': 'application/json',
    '.markdown': 'text/markdown',
    '.md': 'text/markdown',
    '.mid': 'audio/midi',
    '.midi': 'audio/midi',
    '.mjs': 'application/javascript',
    '.m4a': 'audio/mp4',
    '.m4v': 'video/mp4',
    '.mkv': 'video/x-matroska',
    '.mov': 'video/quicktime',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.mpeg': 'video/mpeg',
    '.mpkg': 'application/vnd.apple.installer+xml',
    '.odp': 'application/vnd.oasis.opendocument.presentation',
    '.ods': 'application/vnd.oasis.opendocument.spreadsheet',
    '.odt': 'application/vnd.oasis.opendocument.text',
    '.oga': 'audio/ogg',
    '.ogv': 'video/ogg',
    '.ogx': 'application/ogg',
    '.opus': 'audio/opus',
    '.otf': 'font/otf',
    '.png': 'image/png',
    '.pdf': 'application/pdf',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.rar': 'application/x-rar-compressed',
    '.rss': 'application/rss+xml',
    '.rtf': 'application/rtf',
    '.sh': 'application/x-sh',
    '.svg': 'image/svg+xml',
    '.swf': 'application/x-shockwave-flash',
    '.tar': 'application/x-tar',
    '.tif': 'image/tiff',
    '.tiff': 'image/tiff',
    '.ts': 'video/mp2t',
    '.ttf': 'font/ttf',
    '.txt': 'text/plain',
    '.vsd': 'application/vnd.visio',
    '.wav': 'audio/wav',
    '.wasm': 'application/wasm',
    '.weba': 'audio/webm',
    '.webm': 'video/webm',
    '.webmanifest': 'application/manifest+json',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.xhtml': 'application/xhtml+xml',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xml': 'application/xml',
    '.yaml': 'application/yaml',
    '.yml': 'application/yaml',
    '.zip': 'application/zip',
    '.7z': 'application/x-7z-compressed',
});

export default class Mime {
    /**
     * Creates the MIME type helper.
     */
    constructor() {
        /** @type {Readonly<Record<string, string>>} */
        let custom = Object.freeze({});

        /**
         * Add application-specific extension-to-MIME mappings.
         * Keys may use or omit the leading dot.
         *
         * @param {TeqFw_Web_Back_Helper_Mime__CustomTypes} types
         */
        this.addTypes = function (types) {
            custom = Object.freeze({...custom, ...normalizeCustomTypes(types)});
        };

        /**
         * Returns the MIME type for the given extension.
         *
         * @param {string} ext - File extension, with or without a leading dot.
         * @returns {string} MIME type if known, otherwise 'application/octet-stream'.
         */
        this.getByExt = function (ext) {
            const key = normalizeExtension(ext);
            return BUILTIN_TYPES[key] || custom[key] || FALLBACK_TYPE;
        };
    }
}
