var MyView = yapp.View.extend({
	template: "myview.html",
	events: {
		"click .btn": "open"
	},
	open: function() {
		alert("It's open !");
	}
});

/* Register template component */
yapp.View.Template.registerComponent("myview", MyView);