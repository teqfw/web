import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import {Factory as TeqFw_Web_Back_Dto_Info_Factory} from '../../../../src/Back/Dto/Info.mjs';

describe('TeqFw_Web_Back_Dto_Info', () => {
    test('creates normalized handler registration dto', () => {
        const factory = new TeqFw_Web_Back_Dto_Info_Factory({
            cast: /** @type {*} */ ({string: (/** @type {*} */ value) => value, array: (/** @type {*} */ value) => value === undefined ? [] : Array.isArray(value) ? value : [value], enum: (/** @type {string} */ value) => value.toUpperCase()}),
            STAGE: {INIT: 'INIT', PROCESS: 'PROCESS', FINALIZE: 'FINALIZE'},
        });

        const dto = factory.create({
            name: 'HandlerA',
            stage: 'process',
            before: 'HandlerB',
            after: ['HandlerC'],
        });

        assert.strictEqual(dto.name, 'HandlerA');
        assert.strictEqual(dto.stage, 'PROCESS');
        assert.deepStrictEqual(dto.before, ['HandlerB']);
        assert.deepStrictEqual(dto.after, ['HandlerC']);
        assert.equal(Object.isFrozen(dto), true);
    });
});
