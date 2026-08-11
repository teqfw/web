import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import TeqFw_Web_Back_Helper_Order_Kahn from '../../../../../src/Back/Helper/Order/Kahn.mjs';

describe('TeqFw_Web_Back_Helper_Order_Kahn', () => {

    describe('sort', () => {
        test('should sort handlers respecting after/before constraints', async () => {
            /** @type {TeqFw_Web_Back_Helper_Order_Kahn} */
            const sorter = new TeqFw_Web_Back_Helper_Order_Kahn();

            // Mock handlers with dependencies
            /**
             * @param {string} name
             * @param {string[]} [after]
             * @param {string[]} [before]
             * @returns {*}
             */
            const mk = (name, after = [], before = []) => ({
                getRegistrationInfo: () => ({name, after, before})
            });

            const a = mk('a');                  // no deps
            const b = mk('b', ['a']);           // after a
            const c = mk('c', [], ['b']);       // before b (== b after c)
            const d = mk('d', ['b', 'c']);      // after b and c

            const result = sorter.sort([a, b, c, d]);
            const names = result.map(h => h.getRegistrationInfo().name);
            assert.deepStrictEqual(names, ['a', 'c', 'b', 'd']);
        });

        test('should detect circular dependency', async () => {
            /** @type {TeqFw_Web_Back_Helper_Order_Kahn} */
            const sorter = new TeqFw_Web_Back_Helper_Order_Kahn();

            /**
             * @param {string} name
             * @param {string[]} [after]
             * @param {string[]} [before]
             * @returns {*}
             */
            const mk = (name, after = [], before = []) => ({
                getRegistrationInfo: () => ({name, after, before})
            });

            const x = mk('x', ['y']);
            const y = mk('y', ['x']);

            assert.throws(() => {
                sorter.sort([x, y]);
            }, /Circular dependency detected/);
        });

        test('should ignore references to unknown handlers', async () => {
            /** @type {TeqFw_Web_Back_Helper_Order_Kahn} */
            const sorter = new TeqFw_Web_Back_Helper_Order_Kahn();

            /**
             * @param {string} name
             * @param {string[]} [after]
             * @param {string[]} [before]
             * @returns {*}
             */
            const mk = (name, after = [], before = []) => ({
                getRegistrationInfo: () => ({name, after, before})
            });

            const a = mk('a', ['ghost']); // ghost does not exist
            const b = mk('b');

            const result = sorter.sort([a, b]);
            const names = result.map(h => h.getRegistrationInfo().name);
            assert.deepStrictEqual(names.sort(), ['a', 'b']); // Order can vary, but no crash
        });
    });
});
