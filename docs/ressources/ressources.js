define([
    "yapp/yapp",

    "text!ressources/code/build/structure.txt",
    "text!ressources/code/build/build.js",
    "text!ressources/code/build/options.js",
    "text!ressources/code/build/module.js",
    "text!ressources/code/application/extend.js",
    "text!ressources/code/application/run.js",
    "text!ressources/code/view/extend.js",
    "text!ressources/code/view/template.js",
    "text!ressources/code/view/template_function.js",
    "text!ressources/code/template/syntax.html",
    "text!ressources/code/template/components.html",
    "text!ressources/code/template/components.js",
    "text!ressources/code/class/extend.js",
    "text!ressources/code/class/initialize.js",
    "text!ressources/code/class/defaults.js",
    "text!ressources/code/class/on.js",
    "text!ressources/code/class/on_all.js",
    "text!ressources/code/class/on_map.js",
    "text!ressources/code/class/on_sub.js",
    "text!ressources/code/class/off.js",
    "text!ressources/code/urls/base.js",
    "text!ressources/code/urls/static.js",
    "text!ressources/code/urls/route.js",
    "text!ressources/code/urls/template.html",
    "text!ressources/code/cache/key.js",
    "text!ressources/code/cache/namespace.js",
    "text!ressources/code/ressources/load.js",
    "text!ressources/code/ressources/namespace.js",
    "text!ressources/code/ressources/loader.js",
], function(yapp) {

    yapp.Ressources.addNamespace("templates", {
        loader: "http",
        base: "templates"
    });

     yapp.Ressources.addNamespace("codes", {
        loader: "require",
        base: "ressources/code",
        mode: "text"
    });
    return {}
});