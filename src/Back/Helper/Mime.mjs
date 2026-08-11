// @ts-check

/**
 * @namespace TeqFw_Web_Back_Helper_Mime
 * @description MIME type helper with built-in mapping for common file extensions.
 * Can be replaced or extended by the application via the DI container.
 */
export default class Mime {
    /**
     * Creates the MIME type helper.
     */
    constructor() {
        /**
         * Mapping from file extension to MIME type.
         * Keys must start with a dot, e.g. '.html'.
         * @type {{[key: string]: string}}
         */
        const _types = Object.freeze({
            '.aac': 'audio/aac',
            '.abw': 'application/x-abiword',
            '.avi': 'video/x-msvideo',
            '.bmp': 'image/bmp',
            '.bz': 'application/x-bzip',
            '.bz2': 'application/x-bzip2',
            '.css': 'text/css',
            '.csv': 'text/csv',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.eot': 'application/vnd.ms-fontobject',
            '.epub': 'application/epub+zip',
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
            '.mid': 'audio/midi',
            '.midi': 'audio/midi',
            '.mjs': 'application/javascript',
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
            '.otf': 'font/otf',
            '.png': 'image/png',
            '.pdf': 'application/pdf',
            '.ppt': 'application/vnd.ms-powerpoint',
            '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            '.rar': 'application/x-rar-compressed',
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
            '.weba': 'audio/webm',
            '.webm': 'video/webm',
            '.webp': 'image/webp',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2',
            '.xhtml': 'application/xhtml+xml',
            '.xls': 'application/vnd.ms-excel',
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            '.xml': 'application/xml',
            '.zip': 'application/zip',
            '.7z': 'application/x-7z-compressed',
        });

        /**
         * Returns the MIME type for the given extension.
         *
         * @param {string} ext - File extension including leading dot (e.g. '.html').
         * @returns {string} MIME type if known, otherwise 'application/octet-stream'.
         */
        this.getByExt = function (ext) {
            return _types[ext.toLowerCase()] || 'application/octet-stream';
        };
    }
}
