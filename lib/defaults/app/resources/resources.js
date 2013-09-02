define([
    "yapp/yapp"
], function(yapp) {

    yapp.Resources.addNamespace("templates", {
        loader: "http",
        base: "templates"
    });
    
    return {}
});