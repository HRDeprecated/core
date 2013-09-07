var View = hr.View.extend({
	template: "test.html"
});
var view = new View();
view.$el.appendTo($("body"));

setInterval(function() {
	view.render();
}, 1000)