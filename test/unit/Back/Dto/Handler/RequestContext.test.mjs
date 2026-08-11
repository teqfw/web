import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import TeqFw_Web_Back_Dto_RequestContext, {Factory as TeqFw_Web_Back_Dto_RequestContext_Factory} from '../../../../../src/Back/Dto/RequestContext.mjs';

describe('TeqFw_Web_Back_Dto_RequestContext', () => {
    test('creates base request context with default mutable state', () => {
        const dto = new TeqFw_Web_Back_Dto_RequestContext();

        assert.strictEqual(dto.request, undefined);
        assert.strictEqual(dto.response, undefined);
        assert.deepStrictEqual(dto.data, {});
        assert.strictEqual(dto.completed, false);
    });

    test('factory creates request context instances', () => {
        const factory = new TeqFw_Web_Back_Dto_RequestContext_Factory();

        const first = factory.create();
        const second = factory.create();

        assert.ok(first instanceof TeqFw_Web_Back_Dto_RequestContext);
        assert.ok(second instanceof TeqFw_Web_Back_Dto_RequestContext);
        assert.notStrictEqual(first, second);
        assert.notStrictEqual(first.data, second.data);
        assert.deepStrictEqual(first.data, {});
        assert.deepStrictEqual(second.data, {});
        assert.strictEqual(first.completed, false);
        assert.strictEqual(second.completed, false);
    });
});
