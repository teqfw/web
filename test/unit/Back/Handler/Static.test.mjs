import {beforeEach, describe, test} from 'node:test';
import assert from 'node:assert/strict';
import TeqFw_Web_Back_Handler_Static from '../../../../src/Back/Handler/Static.mjs';
import {Factory as TeqFw_Web_Back_Dto_Info_Factory} from '../../../../src/Back/Dto/Info.mjs';
import TeqFw_Web_Back_Helper_Cast from '../../../../src/Back/Helper/Cast.mjs';
import TeqFw_Web_Back_Enum_Stage from '../../../../src/Back/Enum/Stage.mjs';

describe('TeqFw_Web_Back_Handler_Static', () => {
    const STAGE = new TeqFw_Web_Back_Enum_Stage();
    const dtoInfoFactory = new TeqFw_Web_Back_Dto_Info_Factory({cast: new TeqFw_Web_Back_Helper_Cast(), STAGE});
    /** @type {*} */
    let registry;
    /** @type {*} */
    let fileService;
    /** @type {*} */
    let respond;
    /** @type {*} */
    let handler;

    beforeEach(() => {
        registry = {
            addConfigs: () => {},
            find: () => null,
        };
        fileService = {
            serve: async () => false,
        };
        respond = {
            isWritable: () => true,
        };
        handler = new TeqFw_Web_Back_Handler_Static({
            registry,
            fileService,
            respond,
            dtoInfoFactory,
            STAGE,
        });
    });

    test('uses PROCESS stage registration info', () => {
        const info = handler.getRegistrationInfo();
        assert.strictEqual(info.stage, STAGE.PROCESS);
        assert.strictEqual(info.name, 'TeqFw_Web_Back_Handler_Static');
    });

    test('marks request completed when file is served', async () => {
        registry.find = () => /** @type {*} */ ({config: {}, rel: 'file.txt'});
        fileService.serve = async () => true;
        const context = /** @type {*} */ ({
            request: {url: '/file.txt'},
            response: {},
            completed: false,
        });

        await handler.handle(context);

        assert.strictEqual(context.completed, true);
    });

    test('does nothing when no source matches request', async () => {
        const context = /** @type {*} */ ({
            request: {url: '/missing'},
            response: {},
            completed: false,
        });

        await handler.handle(context);

        assert.strictEqual(context.completed, false);
    });
});
