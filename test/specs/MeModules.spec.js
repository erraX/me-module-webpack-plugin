import {join} from 'path';
import MeModules from '../../src/MeModules';
import env from '../../src/env';

const ME_SCRIPT_PATH = join(__dirname, '../codebase/scripts/lib/me.js');
const basePath = join(__dirname, '../codebase/scripts');
const initOptions = {basePath};

env(initOptions);

let meModules;
beforeEach(() => {
    meModules = new MeModules(initOptions);
});

describe('MeModules.init', () => {
    test('Should init `basePath`', () => {
        expect(meModules.basePath).toBe(basePath);
    });
    test('Should init `modules`', () => {
        expect(meModules.modules).not.toBe(me._modules);
        expect(meModules.modules).not.toBeEmpty();
    });
});

describe('MeModules.getModules', () => {
    test('Should get all modules', () => {
        expect(meModules.getModules()).toBe(meModules.modules);
    });
});

describe('MeModules.getModuleByName', () => {
    test('Should get module by name', () => {
        expect(meModules.getModuleByName('mejs')).toBe(meModules.modules.mejs);
    });
    test('Should get `undefined` when nothing matched', () => {
        expect(meModules.getModuleByName('nothing')).toBeUndefined();
    });
});

describe('MeModules.getModuleByAbsSrc', () => {
    test('Should get module by absolute path', () => {
        expect(meModules.getModuleByAbsSrc(ME_SCRIPT_PATH)).toBe(meModules.modules.mejs);
    });
    test('Should get `undefined` when nothing matched', () => {
        expect(meModules.getModuleByAbsSrc('nothing')).toBeUndefined();
    });
});

describe('MeModules.get', () => {
    test('Should get module by name', () => {
        expect(meModules.get({name: 'mejs'})).toBe(meModules.modules.mejs);
    });
    test('Should get module by absolute path', () => {
        expect(meModules.get({src: ME_SCRIPT_PATH})).toBe(meModules.modules.mejs);
    });
    test('Should get `undefined` when nothing matched', () => {
        expect(meModules.get({})).toBeUndefined();
    });

});

describe('MeModules.remove', () => {
    test('Should remove module by name', () => {
        meModules.remove('mejs');
        expect(meModules.get({name: 'mejs'})).toBeUndefined();
    });
});

describe('MeModules.diggCss', () => {
    test('Should be empty css array when no css to require', () => {
        const modules = {
            main: {}
        };
        meModules.diggCss(modules);
        expect(modules.main.css).toEqual([]);
    });
    test('Should be css array when require a css string', () => {
        const modules = {
            main: {
                css: 'main.css'
            }
        };
        meModules.diggCss(modules);
        expect(modules.main.css).toBeArray();
        expect(modules.main.css[0]).toBe(join(__dirname, '../codebase/styles/main.css'));
    });
    test('Should be css array when require a css array', () => {
        const modules = {
            main: {
                css: ['main.css', 'main2.css']
            }
        };
        meModules.diggCss(modules);
        expect(modules.main.css).toBeArray();
        expect(modules.main.css[0]).toBe(join(__dirname, '../codebase/styles/main.css'));
        expect(modules.main.css[1]).toBe(join(__dirname, '../codebase/styles/main2.css'));
    });
    test('Should not add to css array when css is invalid', () => {
        const modules = {
            main: {
                css: [() => {}, {}, [], null, undefined, 123]
            }
        };
        meModules.diggCss(modules);
        expect(modules.main.css).toEqual([]);
    });
});

describe('MeModules.prepareModules', () => {
    test('Should prepare modules attributes', () => {
        const modules = {
            nothing: {
                src: 'nothing.js',
            },
            app: {
                src: 'app/app.js',
                require: ['bi_add']
            },
            bi_add: {
                src: 'app/bi/bi_add.js'
            },
        };

        meModules.prepareModules(modules);
        expect(modules.nothing).toBeUndefined();
        expect(modules.app.absolutePath).toBe(join(basePath, 'app/app.js'));
        expect(modules.app.name).toBe('app');
        expect(modules.app.isMeModule).toBe(true);
        expect(modules.app.code).not.toBeEmpty();
        expect(modules.app.require).toEqual(['mejs', 'bi_add']);
        expect(modules.bi_add.require).toEqual(['mejs']);
    });
});

describe('MeModules.diggSelfExports', () => {
    test('Should digg self exports', () => {
        const modules = {
            bi_add: {
                src: 'app/bi/bi_add.js'
            }
        };

        meModules.prepareModules(modules);
        meModules.diggSelfExports(modules);
        expect(modules.bi_add.selfExports).toEqual(['bi_add', 'bi_add_relay']);
    });
});

describe('MeModules.flattenModuleDeps', () => {
    test('Should flatten parents dependencies ', () => {
        const modules = {
            main: {
                name: 'main',
                require: ['request'],
                selfExports: []
            },
            request: {
                name: 'request',
                require: ['utils'],
                selfExports: ['requestA', 'requestB']
            },
            utils: {
                name: 'utils',
                selfExports: ['utilsA']
            }
        };

        expect(meModules.flattenModuleDeps(true, modules, modules.main)).toEqual({
            request: ['requestA', 'requestB'],
            utils: ['utilsA']
        });
        expect(meModules.flattenModuleDeps(true, modules, modules.request)).toEqual({
            utils: ['utilsA']
        });
        expect(meModules.flattenModuleDeps(true, modules, modules.utils)).toEqual({});
    });
});

describe('test all', () => {
    test('Should all work', () => {
        expect(meModules.get({name: 'operation_index'}).require).toEqual(['mejs', 'bi_add']);
        expect(meModules.get({name: 'bi_add'}).require).toEqual(['mejs', 'request']);
    });
});
