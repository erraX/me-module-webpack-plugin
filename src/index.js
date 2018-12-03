import {getMeModuleInstance, destroyInstance} from 'me-module-utils';

const PLUGIN_NAME = 'MeModulePlugin';

export default class MeModulePlugin {
    constructor({depFiles = []}) {
        this.depFiles = depFiles;
    }

    apply(compiler) {
        compiler.hooks.emit.tap(PLUGIN_NAME, compilation => {

            // 把 `app.js` `require.js` 添加进监听文件中
            // 这两个文件描述了模块之间依赖关系
            // 依赖关系变了，需要全部重新分析
            this.depFiles.forEach(file => compilation.fileDependencies.add(file));
        });

        compiler.hooks.watchRun.tap(PLUGIN_NAME, compilation => {
            if (!global.meModules) return;
            destroyInstance();
            getMeModuleInstance();
            // global.meModules = null;
            // global.getMeModulesInstance();
        });
    }
};
