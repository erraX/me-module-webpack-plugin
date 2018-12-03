me.provide(function(exports) {
	eval(exports.extract());
	Loader.registerPath('app/bi')({
		bi_add: {
			require: ['request']
		}
	});

	Loader.registerPath('app/operation')({
		operation_index: {
			require: ['bi_add'],
			css: ['operation_index']
		}
	});
});
