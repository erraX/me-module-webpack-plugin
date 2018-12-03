import {createEmptyMe} from "../../src/meFactory";

describe('meFactory', () => {
    test('Should create new me object', () => {
        const me = createEmptyMe();
        const me2 = createEmptyMe();
        me.attr = 'attr';
        me._modules.a = 'a';

        expect(me).not.toBe(me2);
        expect(me._modules).not.toBe(me2._modules);
        expect(me2._modules).toBeEmpty();
    });
});
