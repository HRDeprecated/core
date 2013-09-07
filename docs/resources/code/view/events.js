var MyView = hr.View.extend({
	template: "myview.html",
	events: {
		"click .btn-open": "open",
		"click .btn-close": "close"
	},
	open: function() {
		alert("It's open !");
	},
	close: function() {
		alert("It's closed !");
	}
});