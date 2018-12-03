import {join} from 'path';
import env from "../../src/env";

const NATIVE_BIND = Function.prototype.bind;

describe('env', () => {
    callEnv();

    test('Should inject `me` object in global scope', () => {
        expect(me).toBeObject();
        expect(me).not.toBeEmpty();
        expect(me._modules).toBeObject();
        expect(me._modules).not.toBeEmpty();
    });

    test('Should reset last environment before re-mock env', () => {
        expect(Function.prototype.bind).toBe(NATIVE_BIND);
    });

    test('Should mock browser env', () => {
        expect(document).toBeObject();
        expect(window).toBeObject();
        expect(document.createElement('div')).toBeInstanceOf(HTMLElement);
    });

    test('Should insert script into head tag', () => {
        const scripts = document.head.querySelectorAll('script');
        expect(scripts.length).toBe(1);
    });

    test('Should load me.js', () => {
        expect(me.slice).toBeFunction();
    });

    test('Should reload me.js', () => {
        callEnv(true);
        const lastMe = me;
        callEnv(true);
        expect(me).not.toBe(lastMe);
        expect(me._modules).not.toBe(lastMe._modules);
        expect(me._modules).toEqual(lastMe._modules);
    });
});

function callEnv(reset) {
    reset && jest.resetModules();
    env({basePath: join(__dirname, '../codebase/scripts')});
}
