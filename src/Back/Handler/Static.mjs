// @ts-check

/**
 * @namespace TeqFw_Web_Back_Handler_Static
 * @description Universal static-file PROCESS handler.
 * @implements {TeqFw_Web_Back_Api_Handler}
 */
export default class Static {
    /**
     * @param {object} deps
     * @param {TeqFw_Web_Back_Handler_Static_A_Registry} deps.registry
     * @param {TeqFw_Web_Back_Handler_Static_A_FileService} deps.fileService
     * @param {TeqFw_Web_Back_Helper_Respond} deps.respond
     * @param {TeqFw_Web_Back_Dto_Info__Factory} deps.dtoInfoFactory
     * @param {TeqFw_Web_Back_Enum_Stage} deps.STAGE
     */
    constructor({registry, fileService, respond, dtoInfoFactory, STAGE}) {

        const _info = dtoInfoFactory.create({
            name: 'TeqFw_Web_Back_Handler_Static',
            stage: STAGE.PROCESS,
        });

        /**
         * Initialize registry with provided sources.
         *
         * @param {TeqFw_Web_Back_Handler_Static_Init_Params} [params]
         * @returns {Promise<void>}
         */
        this.init = async (params = {}) => {
            const {sources = []} = params;
            registry.addConfigs(sources);
        };

        /**
         * Attempt to handle incoming request.
         *
         * @param {TeqFw_Web_Back_Dto_RequestContext} context
         * @returns {Promise<void>}
         */
        this.handle = async (context) => {
            const req = context.request;
            const res = context.response;
            if (!respond.isWritable(res)) return;
            if (req.url === undefined) return;
            const urlPath = decodeURIComponent(req.url.split('?')[0]);
            const match = registry.find(urlPath);
            if (!match) return;
            const served = await fileService.serve(match.config, match.rel, req, res);
            if (served) {
                context.completed = true;
            }
        };

        /**
         * @returns {TeqFw_Web_Back_Dto_Info}
         */
        this.getRegistrationInfo = () => _info;
    }
}

/**
 * Dependencies for the static handler.
 */
export const __deps__ = Object.freeze({
    default: {
        registry: 'TeqFw_Web_Back_Handler_Static_A_Registry$',
        fileService: 'TeqFw_Web_Back_Handler_Static_A_FileService$',
        respond: 'TeqFw_Web_Back_Helper_Respond$',
        dtoInfoFactory: 'TeqFw_Web_Back_Dto_Info__Factory$',
        STAGE: 'TeqFw_Web_Back_Enum_Stage$',
    },
});
