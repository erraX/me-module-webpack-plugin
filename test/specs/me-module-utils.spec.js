import {join} from 'path';
import MeModules from '../../src/MeModules';
import {
    initMeModules,
    getMeModuleInstance,
    destroyInstance
} from "../../src/index";

const basePath = join(__dirname, '../codebase/scripts');
const initOptions = {basePath};

describe('me-module-utils.initMeModules', () => {
    test('Should return `MeModules` instance', () => {
        const meModules = initMeModules(initOptions);
        expect(meModules).toBeInstanceOf(MeModules);
    });
});

describe('me-module-utils.getMeModuleInstance', () => {
    test('Should keep a singleton `MeModule` instance', () => {
        expect(getMeModuleInstance(initOptions)).toEqual(getMeModuleInstance(initOptions));
    });
});

describe('me-module-utils.destroyInstance', () => {
    test('Should reset singleton `MeModule` instance', () => {
        const meModules = getMeModuleInstance(initOptions);
        destroyInstance();
        expect(getMeModuleInstance(initOptions)).not.toBe(meModules);
    });

    test('Should cache last init options', () => {
        destroyInstance(true);
        expect(getMeModuleInstance(initOptions)).toBe(getMeModuleInstance());
    });

    test('Should clear last init options cache', () => {
        destroyInstance(true);
        expect(() => getMeModuleInstance()).toThrow('You should pass `options` to get `MeModule` instance');
    });
});
