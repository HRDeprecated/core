// Using HTTP
hr.Resources.addNamespace("templates", {
    loader: "http",
    base: "templates"	// Base directory for templates in the static directory
});

// Using Require
// You need to include all the templates in the dependencies of a module
hr.Resources.addNamespace("templates", {
    loader: "require",
    base: "resources/templates",
    mode: "text"
});

// Using your own resources loader
var TEMPLATES = {
	"hello": "<b>Hello world !</b>"
}
hr.Resources.addLoader("mytemplates", function(query, callback, args, config) {
    if (TEMPLATES[query] == null) {
    	callback.reject();
    } else {
    	callback.resolve(TEMPLATES[query])
    }
});
hr.Resources.addNamespace("templates", {
    loader: "mytemplates"
});