import {join} from 'path';
import fakeMeModules from '../helpers/fakeMeModules';
import {
    isMeModule,
    normalizeVariableName,
    safeReadFileSync,
    getMatchedExportsName,
    relativeRequirePath
} from '../../src/utils';

describe('utils.isMeModule', () => {
    test('Should detect me module', () => {
        expect(isMeModule('me.provide(\'module\', function (){}')).toBe(true);
        expect(isMeModule('me.require([\'jquery\']')).toBe(true);
    });

    test('Should detect not a valid module', () => {
        expect(isMeModule('')).toBe(false);
        expect(isMeModule(null)).toBe(false);
        expect(isMeModule(undefined)).toBe(false);
        expect(isMeModule([])).toBe(false);
        expect(isMeModule({})).toBe(false);
        expect(isMeModule(() => {})).toBe(false);
    });

    test('Should detect the module is\'nt me module', () => {
        expect(isMeModule('var a = require(\'a\');')).toBe(false);
        expect(isMeModule('(function () {})();')).toBe(false);
        expect(isMeModule('import a from \'a\'')).toBe(false);
    });
});

describe('utils.normalizeVariableName', () => {
    test('Should transform to valid variable name', () => {
        expect(normalizeVariableName('vue-bi-radio-button')).toBe('vue_bi_radio_button');
    });

    test('Should transform `null` or `undefined` to empty string', () => {
        expect(normalizeVariableName(null)).toBe('');
        expect(normalizeVariableName()).toBe('');
    });

    test('Should transform Number to String', () => {
        expect(normalizeVariableName(0)).toBe('');
        expect(normalizeVariableName(-1)).toBe('_1');
        expect(normalizeVariableName(123)).toBe('123');
        expect(normalizeVariableName(NaN)).toBe('');
    });

    const errString = 'Cannot normalize none String/Number type';
    test('Cannot transform none String/Number type', () => {
        expect(() => normalizeVariableName(() => {})).toThrow(errString);
        expect(() => normalizeVariableName({})).toThrow(errString);
        expect(() => normalizeVariableName([])).toThrow(errString);
    });
});

describe('utils.safeReadFileSync', () => {
    test('Should read file', () => {
        expect(safeReadFileSync(join(__dirname, '../helpers/fileToRead.js'))).toBe([
            'me.provide(function () {\n',
            '    console.log(\'This is a test file.\');\n',
            '});\n'
        ].join(''));
    });

    test('Content is empty when file not exists', () => {
        expect(safeReadFileSync('./not-exists.txt')).toBe('');
    });
});

describe('utils.relativeRequirePath', () => {
    test('Should calculate relative path', () => {
        expect(relativeRequirePath('/home/user', '/home/user/a.js')).toBe('./a');
        expect(relativeRequirePath('/home/user', '/a.js')).toBe('../../a');
        expect(relativeRequirePath('/home/user', '/home/user/project/a.js')).toBe('./project/a');
        expect(relativeRequirePath('./home/user', './a.js')).toBe('../../a');
        expect(relativeRequirePath('/home/user', '/home/user/a.js.js')).toBe('./a.js');
    });
});

describe('utils.getMatchedExportsName', () => {
    test('Should extract exports name', () => {
        for (let [content, result] of fakeMeModules) {
            expect(getMatchedExportsName(content)).toEqual(result);
        }
    });
});
