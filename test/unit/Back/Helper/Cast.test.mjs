import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import TeqFw_Web_Back_Helper_Cast from '../../../../src/Back/Helper/Cast.mjs';

describe('TeqFw_Web_Back_Helper_Cast', () => {
    test('casts arrays and enum values', () => {
        const cast = new TeqFw_Web_Back_Helper_Cast();
        assert.deepStrictEqual(cast.array('a', cast.string), ['a']);
        assert.strictEqual(cast.enum('process', {PROCESS: 'PROCESS'}, {upper: true}), 'PROCESS');
    });

    test('casts primitives and allow map', () => {
        const cast = new TeqFw_Web_Back_Helper_Cast();
        assert.strictEqual(cast.int('42'), 42);
        assert.strictEqual(cast.decimal('2.5'), 2.5);
        assert.deepStrictEqual(cast.stringArrayMap({pkg: ['a', 'b']}), {pkg: ['a', 'b']});
    });
});
