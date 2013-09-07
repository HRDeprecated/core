var View = hr.View.extend({
	render: function() {
		this.$el.html("Hello World !");

		// Call "ready" to signal the component is ready
		return this.ready();
	}
});