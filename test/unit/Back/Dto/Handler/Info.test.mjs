import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import {Factory as TeqFw_Web_Back_Dto_Info_Factory} from '../../../../../src/Back/Dto/Info.mjs';
import TeqFw_Web_Back_Helper_Cast from '../../../../../src/Back/Helper/Cast.mjs';
import TeqFw_Web_Back_Enum_Stage from '../../../../../src/Back/Enum/Stage.mjs';

describe('TeqFw_Web_Back_Dto_Info', () => {
    test('creates normalized handler registration dto', () => {
        const factory = new TeqFw_Web_Back_Dto_Info_Factory({
            cast: new TeqFw_Web_Back_Helper_Cast(),
            STAGE: new TeqFw_Web_Back_Enum_Stage(),
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
