import test from 'node:test';
import assert from 'node:assert/strict';
import {Factory as TeqFw_Web_Back_Dto_Source_Factory} from '../../../../../src/Back/Dto/Source.mjs';

test.describe('TeqFw_Web_Back_Dto_Source', () => {
  test('should create valid config DTO with casted fields', async () => {
    /** @type {*} */
    const cast = {
      string: (/** @type {*} */ d) => typeof d === 'string' ? d : undefined,
      stringArrayMap: (/** @type {*} */ d) => d,
      array: (/** @type {*} */ d, /** @type {*} */ item) => Array.isArray(d) ? d.map(item) : [],
    };
    /** @type {TeqFw_Web_Back_Dto_Source__Factory} */
    const factory = new TeqFw_Web_Back_Dto_Source_Factory({cast});
    const dto = factory.create({
      root: '/abs/path',
      prefix: '/src/',
      allow: { vue: ['dist/vue.global.js'] },
      defaults: ['index.html'],
    });
    assert.strictEqual(dto.root, '/abs/path');
    assert.strictEqual(dto.prefix, '/src/');
    assert.deepStrictEqual(dto.allow, { vue: ['dist/vue.global.js'] });
    assert.deepStrictEqual(dto.defaults, ['index.html']);
    assert.equal(Object.isFrozen(dto), true);
  });

  test('should return undefined fields if values are invalid', async () => {
    /** @type {*} */
    const cast = {
      string: () => undefined,
      stringArrayMap: () => ({}),
      array: () => [],
    };
    /** @type {TeqFw_Web_Back_Dto_Source__Factory} */
    const factory = new TeqFw_Web_Back_Dto_Source_Factory({cast});
    const dto = factory.create({});
    assert.strictEqual(dto.root, undefined);
    assert.strictEqual(dto.prefix, undefined);
    assert.deepStrictEqual(dto.allow, {});
    assert.deepStrictEqual(dto.defaults, []);
  });
});
