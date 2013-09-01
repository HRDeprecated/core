// Using HTTP
yapp.Ressources.addNamespace("templates", {
    loader: "http",
    base: "templates"	// Base directory for templates in the static directory
});

// Using Require
// You need to include all the templates in the dependencies of a module
yapp.Ressources.addNamespace("templates", {
    loader: "require",
    base: "ressources/templates",
    mode: "text"
});

// Using your own ressources loader
var TEMPLATES = {
	"hello": "<b>Hello world !</b>"
}
yapp.Ressources.addLoader("mytemplates", function(query, callback, args, config) {
    if (TEMPLATES[query] == null) {
    	callback.reject();
    } else {
    	callback.resolve(TEMPLATES[query])
    }
});
yapp.Ressources.addNamespace("templates", {
    loader: "mytemplates"
});