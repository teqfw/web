import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import TeqFw_Web_Back_Enum_Server_Type from '../../../../../src/Back/Enum/Server/Type.mjs';

describe('TeqFw_Web_Back_Enum_Server_Type', () => {
    test('contains supported transport values', () => {
        const type = new TeqFw_Web_Back_Enum_Server_Type();
        assert.deepStrictEqual(
            {HTTP: type.HTTP, HTTP2: type.HTTP2, HTTPS: type.HTTPS},
            {HTTP: 'http', HTTP2: 'http2', HTTPS: 'https'}
        );
    });
});
