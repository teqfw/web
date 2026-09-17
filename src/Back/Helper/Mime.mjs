// @ts-check

/**
 * @namespace TeqFw_Web_Back_Helper_Mime
 * @description MIME type helper with built-in mapping for common file extensions.
 * Consumers may provide additional or explicit per-instance mappings through
 * addTypes() and overrideTypes().
 */

const FALLBACK_TYPE = 'application/octet-stream';
const MIME_TYPE_PATTERN = /^[^\s/;]+\/[^\s/;]+$/;
const PARAMETER_NAME_PATTERN = /^[^\s"=;]+$/;
const CHARSET_PATTERN = /^[^\s"=;]+$/;

/**
 * Validate a complete HTTP Content-Type value.
 *
 * @param {*} value
 * @returns {TeqFw_Web_Back_Helper_Mime__ContentType}
 */
function parseContentType(value) {
    if (typeof value !== 'string') {
        throw new TypeError('MIME type must be a string');
    }

    const parts = value.split(';');
    const mediaType = parts.shift()?.trim();
    if (!mediaType || !MIME_TYPE_PATTERN.test(mediaType)) {
        throw new TypeError(`Invalid MIME type: ${value}`);
    }

    let hasCharset = false;
    for (const rawParameter of parts) {
        const parameter = rawParameter.trim();
        const separator = parameter.indexOf('=');
        if (separator < 1) {
            throw new TypeError(`Invalid MIME parameter: ${value}`);
        }

        const name = parameter.slice(0, separator).trim();
        let parameterValue = parameter.slice(separator + 1).trim();
        if (!PARAMETER_NAME_PATTERN.test(name) || !parameterValue) {
            throw new TypeError(`Invalid MIME parameter: ${value}`);
        }

        if (parameterValue.startsWith('"')) {
            if (!parameterValue.endsWith('"') || parameterValue.length < 2) {
                throw new TypeError(`Invalid MIME parameter: ${value}`);
            }
            parameterValue = parameterValue.slice(1, -1);
        } else if (/[\s"]/.test(parameterValue)) {
            throw new TypeError(`Invalid MIME parameter: ${value}`);
        }

        if (name.toLowerCase() === 'charset') {
            if (hasCharset || !CHARSET_PATTERN.test(parameterValue)) {
                throw new TypeError(`Invalid MIME charset: ${value}`);
            }
            hasCharset = true;
        }
    }

    return {value: value.trim(), mediaType, hasCharset};
}

/**
 * Apply the default charset policy to a complete content type.
 *
 * @param {string} value
 * @returns {string}
 */
function toResponseContentType(value) {
    const parsed = parseContentType(value);
    if (parsed.mediaType.toLowerCase().startsWith('text/') && !parsed.hasCharset) {
        return `${parsed.value}; charset=utf-8`;
    }
    return parsed.value;
}

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
 * Validate and copy MIME mappings so callers cannot mutate helper state.
 *
 * @param {*} types
 * @returns {Readonly<Record<string, string>>}
 */
function normalizeTypes(types) {
    if (types === undefined) {
        return Object.freeze({});
    }
    if (typeof types !== 'object' || types === null || Array.isArray(types)) {
        throw new TypeError('types must be a non-null object');
    }

    /** @type {Record<string, string>} */
    const normalized = {};
    for (const [extension, mimeType] of Object.entries(types)) {
        const key = normalizeExtension(extension);
        if (!/^\.[^\s/]+$/.test(key)) {
            throw new TypeError(`Invalid MIME extension: ${extension}`);
        }
        if (Object.hasOwn(normalized, key)) {
            throw new TypeError(`Duplicate MIME extension: ${extension}`);
        }
        normalized[key] = parseContentType(mimeType).value;
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
        /** @type {Readonly<Record<string, string>>} */
        let overrides = Object.freeze({});

        /**
         * Add application-specific extension-to-Content-Type mappings.
         * Keys may use or omit the leading dot. Built-in mappings retain
         * precedence; textual custom values receive the default UTF-8 charset.
         *
         * @param {TeqFw_Web_Back_Helper_Mime__CustomTypes} types
         */
        this.addTypes = function (types) {
            custom = Object.freeze({...custom, ...normalizeTypes(types)});
        };

        /**
         * Explicitly replace built-in MIME mappings for this helper instance.
         * Only extensions present in the built-in mapping can be overridden.
         *
         * @param {TeqFw_Web_Back_Helper_Mime__OverrideTypes} types
         */
        this.overrideTypes = function (types) {
            const normalized = normalizeTypes(types);
            for (const extension of Object.keys(normalized)) {
                if (!Object.hasOwn(BUILTIN_TYPES, extension)) {
                    throw new TypeError(`Cannot override unknown built-in MIME extension: ${extension}`);
                }
            }
            overrides = Object.freeze({...overrides, ...normalized});
        };

        /**
         * Returns the complete HTTP Content-Type for the given extension.
         * Textual values receive charset=utf-8 unless a charset is already
         * present; binary and non-textual values are returned without one.
         *
         * @param {string} ext - File extension, with or without a leading dot.
         * @returns {string} Content-Type if known, otherwise 'application/octet-stream'.
         */
        this.getByExt = function (ext) {
            const key = normalizeExtension(ext);
            return toResponseContentType(overrides[key] || BUILTIN_TYPES[key] || custom[key] || FALLBACK_TYPE);
        };
    }
}
