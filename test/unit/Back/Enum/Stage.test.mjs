import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import TeqFw_Web_Back_Enum_Stage from '../../../../src/Back/Enum/Stage.mjs';

describe('TeqFw_Web_Back_Enum_Stage', () => {
    test('contains canonical stage names', () => {
        const stage = new TeqFw_Web_Back_Enum_Stage();
        assert.deepStrictEqual(
            {INIT: stage.INIT, PROCESS: stage.PROCESS, FINALIZE: stage.FINALIZE},
            {INIT: 'INIT', PROCESS: 'PROCESS', FINALIZE: 'FINALIZE'}
        );
    });
});
