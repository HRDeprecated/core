var MyView = hr.View.extend({
	template: "myview.html",
	events: {
		"click .btn": "open"
	},
	open: function() {
		alert("It's open !");
	}
});

/* Register template component */
hr.View.Template.registerComponent("myview", MyView);