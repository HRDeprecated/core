var Router = hr.Router.extend({
    routes: {
        "home": "home",                    // #/home
        "user/:id": "user",                // #/user/samy
        "search/:query":        "search",  // #/search/kiwis
        "search/:query/p:page": "search"   // #/search/kiwis/p7
    }
});


var router = new Router();
router.on("route:home", function() {
    ...
});
router.on("route:user", function() {
    ...
});
router.on("route:search", function() {
    ...
});