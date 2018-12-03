me.provide('bi_add', function(exports){
	eval(me.extract());
	exports.bi_add = 'bi_add';
	function fn() {
	    exports.mRequest();
		exports.bi_add_relay = 'relay export';
	}
});
