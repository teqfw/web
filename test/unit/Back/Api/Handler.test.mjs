import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import TeqFw_Web_Back_Api_Handler from '../../../../src/Back/Api/Handler.mjs';

describe('TeqFw_Web_Back_Api_Handler', () => {
    test('throws for abstract methods', async () => {
        const handler = new TeqFw_Web_Back_Api_Handler();

        await assert.rejects(async () => handler.handle(/** @type {*} */ ({})), /Method not implemented/);
        assert.throws(() => handler.getRegistrationInfo(), /Method not implemented/);
    });
});
