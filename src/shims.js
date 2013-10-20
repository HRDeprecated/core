define(function() {
	if(!Function.prototype.bind) {
		Function.prototype.bind = function(newThis) {
			var that = this;
			return function(){ 
				return that.apply(newThis, arguments); 
			};
		}
	}

    return {};
});