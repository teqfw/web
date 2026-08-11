import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import Container from '@teqfw/di';
import NamespaceRegistry from '@teqfw/di/node/registry/namespace';

import {__deps__ as dtoInfoDeps} from '../../src/Back/Dto/Info.mjs';
import {__deps__ as dtoSourceDeps} from '../../src/Back/Dto/Source.mjs';
import {__deps__ as runtimeConfigDeps} from '../../src/Back/Config/Runtime.mjs';
import {__deps__ as runtimeTlsDeps} from '../../src/Back/Config/Runtime/Tls.mjs';
import {__deps__ as staticHandlerDeps} from '../../src/Back/Handler/Static.mjs';
import {__deps__ as preLogDeps} from '../../src/Back/Handler/Pre/Log.mjs';
import {__deps__ as staticConfigDeps} from '../../src/Back/Handler/Static/A/Config.mjs';
import {__deps__ as staticFallbackDeps} from '../../src/Back/Handler/Static/A/Fallback.mjs';
import {__deps__ as staticFileServiceDeps} from '../../src/Back/Handler/Static/A/FileService.mjs';
import {__deps__ as staticRegistryDeps} from '../../src/Back/Handler/Static/A/Registry.mjs';
import {__deps__ as staticResolverDeps} from '../../src/Back/Handler/Static/A/Resolver.mjs';
import {__deps__ as respondDeps} from '../../src/Back/Helper/Respond.mjs';
import {__deps__ as pipelineEngineDeps} from '../../src/Back/PipelineEngine.mjs';
import {__deps__ as serverDeps} from '../../src/Back/Server.mjs';

const APP_ROOT = path.resolve(import.meta.dirname, '../..');
const DEP_DESCRIPTORS = [
    dtoInfoDeps,
    dtoSourceDeps,
    runtimeConfigDeps,
    runtimeTlsDeps,
    staticHandlerDeps,
    preLogDeps,
    staticConfigDeps,
    staticFallbackDeps,
    staticFileServiceDeps,
    staticRegistryDeps,
    staticResolverDeps,
    respondDeps,
    pipelineEngineDeps,
    serverDeps,
];
const MANAGED_MODULE_IDS = [
    'TeqFw_Web_Back_Enum_Stage$',
    'TeqFw_Web_Back_Enum_Server_Type$',
    'TeqFw_Web_Back_Helper_Cast$',
    'TeqFw_Web_Back_Helper_Mime$',
    'TeqFw_Web_Back_Helper_Order_Kahn$',
    'TeqFw_Web_Back_Helper_Respond$',
    'TeqFw_Web_Back_Dto_Info$',
    'TeqFw_Web_Back_Dto_Info__Factory$',
    'TeqFw_Web_Back_Dto_Source$',
    'TeqFw_Web_Back_Dto_Source__Factory$',
    'TeqFw_Web_Back_Config_Runtime_Tls__Factory$',
    'TeqFw_Web_Back_Config_Runtime__Factory$',
    'TeqFw_Web_Back_Handler_Static_A_Config$',
    'TeqFw_Web_Back_Handler_Static_A_Fallback$',
    'TeqFw_Web_Back_Handler_Static_A_FileService$',
    'TeqFw_Web_Back_Handler_Static_A_Registry$',
    'TeqFw_Web_Back_Handler_Static_A_Resolver$',
    'TeqFw_Web_Back_Handler_Pre_Log$',
    'TeqFw_Web_Back_Handler_Static$',
    'TeqFw_Web_Back_PipelineEngine$',
];

async function createContainer() {
    const container = new Container();
    const registry = new NamespaceRegistry({fs, path, appRoot: APP_ROOT});
    for (const {prefix, dirAbs, ext} of await registry.build()) {
        container.addNamespaceRoot(prefix, dirAbs, ext);
    }
    container.enableTestMode();
    return container;
}

describe('TeqFW ES6 module convention integration', () => {
    test('freezes dependency descriptors for managed modules', () => {
        for (const descriptor of DEP_DESCRIPTORS) {
            assert.equal(Object.isFrozen(descriptor), true);
        }
    });

    test('keeps container-managed modules safe to import and instantiate', async () => {
        const container = await createContainer();

        for (const id of MANAGED_MODULE_IDS) {
            const instance = await container.get(id);
            assert.ok(instance, `Expected container instance for ${id}`);
        }

        const logger = await container.get('TeqFw_Log_Provider$');
        const cfgLoader = await container.get('TeqFw_Cfg_Loader$');
        const cfgObject = await container.get('TeqFw_Cfg_Source_Object$');
        await cfgLoader.load([cfgObject.create({
            TEQFW_WEB__HOST: '127.0.0.1',
            TEQFW_WEB__PORT: '3001',
            TEQFW_WEB__TYPE: 'http',
        })]);
        const runtimeConfigFactory = await container.get('TeqFw_Web_Back_Config_Runtime__Factory$');
        const runtimeConfig = await container.get('TeqFw_Web_Back_Config_Runtime$');
        assert.equal(Object.isFrozen(runtimeConfig), true);
        const runtimeFromFactory = runtimeConfigFactory.configure();
        runtimeConfigFactory.freeze();
        const server = await container.get('TeqFw_Web_Back_Server$');
        const STAGE = await container.get('TeqFw_Web_Back_Enum_Stage$');
        const SERVER_TYPE = await container.get('TeqFw_Web_Back_Enum_Server_Type$');
        const cast = await container.get('TeqFw_Web_Back_Helper_Cast$');
        const kahn = await container.get('TeqFw_Web_Back_Helper_Order_Kahn$');

        assert.equal(typeof logger.forSource, 'function');
        assert.equal(typeof server.start, 'function');
        assert.equal(runtimeFromFactory, undefined);
        assert.equal(runtimeConfig.host, '127.0.0.1');
        assert.equal(runtimeConfig.port, 3001);
        assert.equal(runtimeConfig.type, 'http');
        assert.equal(typeof runtimeConfig.tls, 'object');
        assert.equal(STAGE.PROCESS, 'PROCESS');
        assert.equal(Object.isFrozen(STAGE), true);
        assert.equal(SERVER_TYPE.HTTPS, 'https');
        assert.equal(Object.isFrozen(SERVER_TYPE), true);
        assert.deepEqual(cast.array(['a', 'b'], cast.string), ['a', 'b']);

        const dtoInfoFactory = await container.get('TeqFw_Web_Back_Dto_Info__Factory$');
        const dtoInfo = dtoInfoFactory.create({name: 'h1', stage: 'process'});
        assert.equal(Object.isFrozen(dtoInfo), true);

        const sourceFactory = await container.get('TeqFw_Web_Back_Dto_Source__Factory$');
        const sourceDto = sourceFactory.create({root: '/tmp'});
        assert.equal(Object.isFrozen(sourceDto), true);

        runtimeConfigFactory.freeze();
        assert.throws(() => {
            runtimeConfig.port = 3002;
        }, /Runtime configuration is immutable\./);

        assert.deepEqual(
            kahn.sort([
                {
                    getRegistrationInfo: () => ({name: 'one', before: ['two']}),
                },
                {
                    getRegistrationInfo: () => ({name: 'two'}),
                },
            ]).map((/** @type {TeqFw_Web_Back_Api_Handler} */ item) => item.getRegistrationInfo().name),
            ['one', 'two']
        );
    });
});
