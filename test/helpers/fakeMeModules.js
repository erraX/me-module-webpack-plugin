export default [
    [
        `
            const name = 'moduleA';
            exports.name = name;
            exports.say_name = () => exports.name;
            exports.fromOtherModule.sayName();
            new exports.Class();
        `,
        ['name', 'say_name']
    ],
    [
        `
            var name = exports.name = 'name;
        `,
        ['name']
    ],
    [
        `
            exports.withoutIndent='moduleA';
            exports.withoutIndent2= 'moduleA';
            exports.withoutIndent3 ='moduleA';
        `,
        ['withoutIndent', 'withoutIndent2', 'withoutIndent3']
    ],
    [
        `
            if (exports.nothing1 == 1) {}
            if (exports.nothing2=== 1) {}
            if (exports.nothing3 !==1) {}
            if (exports.nothing4!=1) {}
        `,
        []
    ]
]
