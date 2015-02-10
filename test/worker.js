require([
	"hr/worker",
	"hr/promise"
], function(TaskWorker, Q) {
	var worker = new TaskWorker();

	worker.register("testSync", function(a, b) {
		return a + b;
	});

	worker.register("testAsync", function(a, b) {
		return Q.delay(300)
		.then(function() {
			return a + b;
		});
	});

	worker.register("testError", function() {
		throw "test";
	});

	// Run the worker
	worker.run();
});